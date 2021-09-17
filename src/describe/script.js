const $ = (x, all) => {
    if (all) return document.querySelectorAll(x, true);
    return document.querySelector(x)
}

const UI = {
    showFile(e) {
        UI.notes.selectedNote = null;
        UI.loading(e.target, true);
        try {
            let sessionData = sessionStorage.getItem(e.target.dataset.fullpath)
            if (sessionData) {
                console.log(sessionData)
                UI.notes.selectedNote = {
                    elm: e.target,
                    message: JSON.parse(sessionData)
                };
                UI.loading(e.target, false)
            } else {
                firebase.storage().ref().child(e.target.dataset.fullpath).getDownloadURL().then(url => {
                    fetch(url).then(value => {
                        if (value.status != 200) {
                            UI.showMessage(`There is an error with this file, status: ${value.status}`)
                            return;
                        }
                        value.json().then(data => {
                            UI.notes.selectedNote = {
                                elm: e.target,
                                message: data
                            };
                            UI.loading(e.target, false)
                        })
                    }).catch(error => {
                        UI.showMessage(error)
                        UI.notes.selectedNote = {
                            elm: e.target,
                            message: null
                        };
                        UI.loading(e.target, false)
                    })
                })
            }
        } catch (error) {
                UI.showMessage(error)
                UI.loading(e.target, false)
            }
    },
    showMessage(msg) {
        $('logger').textContent += '>:' + msg + '\n';
    },
    loading(elm, loading = 'toggle', blockPointerEvents = true, colorArray = []) {
        switch (loading) {
            case true: {
                if (blockPointerEvents) {
                    elm.disabled = true;
                }
                colorArray[0] ? elm.style.setProperty('--color1', colorArray[0]) : null
                colorArray[1] ? elm.style.setProperty('--color2', colorArray[1]) : null
                elm.classList.add('mine_chop_dig-loading')
                break;
            }
            case false: {
                if (blockPointerEvents) {
                    elm.disabled = false;
                }
                elm.classList.remove('mine_chop_dig-loading')
                colorArray[0] ? elm.style.setProperty('--color1', colorArray[0]) : null
                break;
            }
            case 'toggle': {
                if (blockPointerEvents && elm.classList.contains('mine_chop_dig-loading')) {
                    UI.loading(elm, false, blockPointerEvents, colorArray)
                } else {
                    UI.loading(elm, true, blockPointerEvents, colorArray)
                }
                break;
            }
        }
    },
    updateNoteFormattings() {
        let currentYellows = localStorage.getItem('describer-yellowed') || '';
        currentYellows = currentYellows.split(',');

        let currentPinks = localStorage.getItem('describer-pinked') || '';
        currentPinks = currentPinks.split(',');
        [...$('nav').children].forEach(x => {
            if (currentYellows.includes(x.textContent)) {
                x.classList.add('yellowed')
            } else {
                x.classList.remove('yellowed')
            }
            if (currentPinks.includes(x.textContent)) {
                x.classList.add('pinked')
            } else {
                x.classList.remove('pinked')
            }
            UI.currentYellows = currentYellows.join();
            UI.currentPinks = currentPinks.join();
        })
    },
    currentYellows: localStorage.getItem('describer-yellowed') || '',
    currentPinks: localStorage.getItem('describer-pinked') || '',
    notes: new Proxy({
        selectedNote: null,
        allNotes: [],
        refresh() {
            $('#file-preview').value = '';
            UI.loading($('nav'), true)
            firebase.storage().ref().child(`describers/user-data/${FIREBASE.user.uid}/`).listAll().then(result => {
                console.log(result)
                UI.notes.allNotes = result.items;
                UI.loading($('nav'), false)
                UI.updateNoteFormattings()
            }).catch(error => {
                UI.showMessage(error)
                UI.loading($('nav'), false)
            })
        }
    }, {
        set: (target, property, value, reciever) => {
            if (property === 'selectedNote') {
                $('related-links').innerHTML = 'Related Links:'
                if (target[property]) {
                    target[property].elm.classList.remove('selected')
                }
                if (value) {
                    console.log(value);
                    value.elm.classList.add('selected')
                    $('#file-preview').value = value.message?.message || value.message || 'Defected File.';

                    if (value.message?.hermit && value.message?.hermit !== '--None--' && value.message?.hermit !== 'none') {
                        let hermitButton = document.createElement('a');
                        hermitButton.textContent = value.message.hermit;
                        hermitButton.href = `https://reddit.com/r/Hermitcraft/wiki/edit/${value.message.hermit}`;
                        hermitButton.target = '_blank';
                        hermitButton.title = `Open ${value.message.hermit}'s wiki page in new tab`;
                        $('related-links').append(hermitButton)
                    }
                    if (value.message?.season && value.message?.season !== '--None--' && value.message?.hermit !== 'none') {
                        let seasonButton = document.createElement('a');
                        seasonButton.textContent = `Season ${value.message.season}`;
                        seasonButton.href = `https://reddit.com/r/Hermitcraft/wiki/edit/season_${value.message.season}`;
                        seasonButton.target = '_blank';
                        seasonButton.title = `Open season ${value.message.season} wiki page in new tab`;
                        $('related-links').append(seasonButton)
                    }
                    console.log(value)
                    sessionStorage.setItem(value.elm.dataset.fullpath, JSON.stringify(value.message))
        
                    $('#invalid').disabled = false;
                    $('#skip').disabled = false;
                    $('#done').disabled = false;
                } else {
                    $('#file-preview').value = '';
                    $('#invalid').disabled = true;
                    $('#skip').disabled = true;
                    $('#done').disabled = true;
                }
                target[property] = value;
            }
            if (property === 'allNotes') {
                target.selectedNote = null;
                if (Array.isArray(value)) {
                    $('nav').innerHTML = '';
                    value.forEach(file => {
                        let tempButton = document.createElement('button');
                        tempButton.textContent = file.name;
                        tempButton.dataset.fullpath = file.fullPath;
                        tempButton.onclick = (e) => {
                            if (e.target.classList.contains('selected')) {
                                let currentYellows = UI.currentYellows;
                                currentYellows = currentYellows.split(',')
                                if (currentYellows.includes(e.target.textContent)) {
                                    currentYellows.splice(currentYellows.indexOf(e.target.textContent), 1);
                                } else {
                                    currentYellows.push(e.target.textContent)
                                }
                                localStorage.setItem('describer-yellowed', currentYellows.join())
                                UI.updateNoteFormattings()
                            } else {
                                UI.showFile(e);
                            }
                        };
                        tempButton.ondblclick = (e) => {
                            console.log('aaaa')
                            let currentPinks = UI.currentPinks;
                            currentPinks = currentPinks.split(',')
                            if (currentPinks.includes(e.target.textContent)) {
                                currentPinks.splice(currentPinks.indexOf(e.target.textContent), 1);
                            } else {
                                currentPinks.push(e.target.textContent)
                            }
                            localStorage.setItem('describer-pinked', currentPinks.join())
                            UI.updateNoteFormattings()
                        }
                        $('nav').append(tempButton);
                    });
                }
            }
        }
    })
}

const FIREBASE = {
    authProviders: {
        google: new firebase.auth.GoogleAuthProvider()
    },
    async authenticate(provider) {
        UI.loading($('#sign-in-google'), true)
        try {
            let result = await firebase.auth().signInWithPopup(provider);
            let credential = result.credential;
            let token = credential.accessToken;
            let user = result.user;
            $('#sign-in-google').textContent = `Sign out of ${user.displayName}`;

            UI.loading($('#sign-in-google'), false)
            UI.showMessage(`Successfully signed in as ${user.displayName} (${user.email})`)
        } catch (error) {
            UI.loading($('#sign-in-google'), false)
            UI.showMessage(error)
        }

    },
    signOut() {
        UI.loading($('#sign-in-google'), true)
        firebase.auth().signOut().then(() => {
            $('#sign-in-google').textContent = 'Sign in with Google';
            UI.notes.refresh();
            UI.loading($('#sign-in-google'), false)
            UI.showMessage('Successfully signed out')
        }).catch((error) => {
            UI.loading($('#sign-in-google'), false)
            UI.showMessage(error.message)
        });
    },
    uploadText(message, contentType = 'application/json', fileName) {
        const storageRef = firebase.storage().ref();
        const metadata = {
            contentType: contentType
        };
        let gistRef = storageRef.child(fileName || 'user-gists/' + Date.now() + '.json');
        return gistRef.putString(message, undefined, metadata)
    },
    async moveFirebaseFile(currentPath, destinationPath, fileContent) {
        let message = '';
        if (!fileContent) {
            try {
                let url = await firebase.storage().ref().child(currentPath).getDownloadURL()
                let value = await fetch(url)
                if (value.status != 200) {
                    UI.showMessage(`There is an error with this file, status: ${value.status}`)
                    return;
                }
                message = value.json()
            } catch (error) {
                UI.showMessage(error)
            }
        } else {
            message = fileContent;
        }
        try {
            const putStringStatus = await firebase.storage().ref().child(destinationPath).putString(message, undefined, {contentType: 'application/json'});
            console.log(putStringStatus);
            const deleteStatus = await firebase.storage().ref().child(currentPath).delete()
            console.log(deleteStatus)
        } catch (error) {
            UI.showMessage(error)
        }
    },
    user: null
}


UI.loading($('#sign-in-google'), true)
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        FIREBASE.user = user;
        $('#sign-in-google').textContent = `Sign out of ${user.displayName}`
        $('#sign-in-google').onclick = () => {
            FIREBASE.signOut()
        }
        UI.notes.refresh()
        UI.loading($('#sign-in-google'), false)
    } else {
        $('#sign-in-google').onclick = () => {
            FIREBASE.authenticate(FIREBASE.authProviders.google)
        }
        UI.loading($('#sign-in-google'), false)
    }
});

$('#done').onclick = async (e) => {
    setTimeout(() => UI.loading($('#done'), true, undefined, ['#00c728', '#238636']), 0)
    FIREBASE.moveFirebaseFile(UI.notes.selectedNote.elm.dataset.fullpath, `describers/bucket/finished/${FIREBASE.user.uid}/${UI.notes.selectedNote.elm.textContent}`).then((res, err) => {
        if (err) {
            UI.showMessage(err)
            UI.notes.refresh()
            setTimeout(() => UI.loading($('#done'), false), 0)
            return;
        }
        console.log(UI.notes.selectedNote)
        firebase.firestore().collection(`/episode-tracker-s${UI.notes.selectedNote.message.season}`).doc(UI.notes.selectedNote.message.hermit).collection(`episode${UI.notes.selectedNote.message.episode}`).doc("describers").set({
            id: FIREBASE.user.uid,
            time: new Date * 1,
            noteName: UI.notes.selectedNote.elm.textContent
        }).then((res, err) => {
            if (err) {
                UI.showMessage(err)
                UI.notes.refresh()
                setTimeout(() => UI.loading($('#done'), false), 0)
                return;
            }
            UI.showMessage('Data successfully sent to the server, thank you!')
            UI.notes.refresh()
            setTimeout(() => UI.loading($('#done'), false), 0)
        })
    })
}
$('#skip').onclick = async (e) => {
    setTimeout(() => UI.loading($('#skip'), true), 0)
    await FIREBASE.moveFirebaseFile(UI.notes.selectedNote.elm.dataset.fullpath, `describers/bucket/skipped/${FIREBASE.user.uid}/${UI.notes.selectedNote.elm.textContent}`)
    UI.notes.refresh()
    setTimeout(() => UI.loading($('#skip'), false), 0)
}
$('#invalid').onclick = async (e) => {
    setTimeout(() => UI.loading($('#invalid'), true, undefined, ['#f8513d', '#b52f20']), 0)
    await FIREBASE.moveFirebaseFile(UI.notes.selectedNote.elm.dataset.fullpath, `describers/bucket/invalid/${FIREBASE.user.uid}/${UI.notes.selectedNote.elm.textContent}`)
    UI.notes.refresh()
    setTimeout(() => UI.loading($('#invalid'), false), 0)
}