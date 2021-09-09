const UI = {
    showFile(e) {
        UI.notes.selectedNote = null;
        UI.loading(e.target, true);
        firebase.storage().ref().child(e.target.dataset.fullpath).getDownloadURL().then(url => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url)
            xhr.addEventListener('readystatechange', () => {
                if (xhr.readyState === 4) {
                    try {
                        let json = JSON.parse(xhr.response);
                        UI.notes.selectedNote = {
                            elm: e.target,
                            message: json
                        };
                        UI.loading(e.target, false)
                    } catch (error) {
                        UI.showMessage(error)
                        UI.notes.selectedNote = {
                            elm: e.target,
                            message: null
                        };
                        UI.loading(e.target, false)
                    }
                }
            })
            xhr.send();

        }).catch(error => {
            UI.showMessage(error)
            UI.loading(e.target, false)
        })
    },
    showMessage(msg) {
        document.getElementsByTagName('logger')[0].textContent += '>:' + msg + '\n';
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
    notes: new Proxy({
        selectedNote: null,
        allNotes: [],
        refresh() {
            previewer.value = '';
            UI.loading(document.getElementsByTagName('nav')[0], true)
            firebase.storage().ref().child(`describers/user-data/${FIREBASE.user.uid}/`).listAll().then(result => {
                console.log(result)
                UI.notes.allNotes = result.items;
                UI.loading(document.getElementsByTagName('nav')[0], false)
            }).catch(error => {
                UI.showMessage(error)
                UI.loading(document.getElementsByTagName('nav')[0], false)
            })
        }
    }, {
        set: (target, property, value, reciever) => {
            if (property === 'selectedNote') {
                document.querySelector('related-links').innerHTML = 'Related Links:'
                if (target[property]) {
                    target[property].elm.classList.remove('selected')
                }
                if (value) {
                    console.log(value);
                    value.elm.classList.add('selected')
                    previewer.value = value.message?.message || value.message || 'Defected File.';

                    if (value.message?.hermit && value.message?.hermit !== '--None--' && value.message?.hermit !== 'none') {
                        let hermitButton = document.createElement('a');
                        hermitButton.textContent = value.message.hermit;
                        hermitButton.href = `https://reddit.com/r/Hermitcraft/wiki/${value.message.hermit}`;
                        hermitButton.target = '_blank';
                        hermitButton.title = `Open ${value.message.hermit}'s wiki page in new tab`;
                        document.querySelector('related-links').append(hermitButton)
                    }
                    if (value.message?.season && value.message?.season !== '--None--' && value.message?.hermit !== 'none') {
                        let seasonButton = document.createElement('a');
                        seasonButton.textContent = `Season ${value.message.season}`;
                        seasonButton.href = `https://reddit.com/r/Hermitcraft/wiki/season_${value.message.season}`;
                        seasonButton.target = '_blank';
                        seasonButton.title = `Open season ${value.message.season} wiki page in new tab`;
                        document.querySelector('related-links').append(seasonButton)
                    }
        
                    document.getElementById('invalid').disabled = false;
                    document.getElementById('skip').disabled = false;
                    document.getElementById('done').disabled = false;
                } else {
                    previewer.value = '';
                    document.getElementById('invalid').disabled = true;
                    document.getElementById('skip').disabled = true;
                    document.getElementById('done').disabled = true;
                }
                target[property] = value;
            }
            if (property === 'allNotes') {
                target.selectedNote = null;
                if (Array.isArray(value)) {
                    document.getElementsByTagName('nav')[0].innerHTML = '';
                    value.forEach(file => {
                        let tempButton = document.createElement('button');
                        tempButton.textContent = file.name;
                        tempButton.dataset.fullpath = file.fullPath;
                        tempButton.onclick = UI.showFile;
                        document.getElementsByTagName('nav')[0].append(tempButton);
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
        UI.loading(document.getElementById('sign-in-google'), true)
        try {
            let result = await firebase.auth().signInWithPopup(provider);
            let credential = result.credential;
            let token = credential.accessToken;
            let user = result.user;
            document.getElementById('sign-in-google').textContent = `Sign out of ${user.displayName}`;

            UI.loading(document.getElementById('sign-in-google'), false)
            UI.showMessage(`Successfully signed in as ${user.displayName} (${user.email})`)
        } catch (error) {
            UI.loading(document.getElementById('sign-in-google'), false)
            UI.showMessage(error)
        }

    },
    signOut() {
        UI.loading(document.getElementById('sign-in-google'), true)
        firebase.auth().signOut().then(() => {
            document.getElementById('sign-in-google').textContent = 'Sign in with Google';
            UI.notes.refresh();
            UI.loading(document.getElementById('sign-in-google'), false)
            UI.showMessage('Successfully signed out')
        }).catch((error) => {
            UI.loading(document.getElementById('sign-in-google'), false)
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
            let url = await firebase.storage().ref().child(currentPath).getDownloadURL()
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false)
            try {
                xhr.send();
                if (xhr.status !== 200) {
                    UI.showMessage(`Error ${xhr.status}: ${xhr.statusText}`)
                } else {
                    message = xhr.response;
                }
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

let previewer = document.getElementById('file-preview');

UI.loading(document.getElementById('sign-in-google'), true)
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        FIREBASE.user = user;
        document.getElementById('sign-in-google').textContent = `Sign out of ${user.displayName}`
        document.getElementById('sign-in-google').onclick = () => {
            FIREBASE.signOut()
        }
        UI.notes.refresh()
        UI.loading(document.getElementById('sign-in-google'), false)
    } else {
        document.getElementById('sign-in-google').onclick = () => {
            FIREBASE.authenticate(FIREBASE.authProviders.google)
        }
        UI.loading(document.getElementById('sign-in-google'), false)
    }
});

document.getElementById('done').onclick = async (e) => {
    setTimeout(() => UI.loading(document.getElementById('done'), true, undefined, ['#00c728', '#238636']), 0)
    await FIREBASE.moveFirebaseFile(UI.notes.selectedNote.elm.dataset.fullpath, `describers/bucket/finished/${FIREBASE.user.uid}/${UI.notes.selectedNote.elm.textContent}`)
    UI.notes.refresh()
    setTimeout(() => UI.loading(document.getElementById('done'), false), 0)
}
document.getElementById('skip').onclick = async (e) => {
    setTimeout(() => UI.loading(document.getElementById('skip'), true), 0)
    await FIREBASE.moveFirebaseFile(UI.notes.selectedNote.elm.dataset.fullpath, `describers/bucket/skipped/${FIREBASE.user.uid}/${UI.notes.selectedNote.elm.textContent}`)
    UI.notes.refresh()
    setTimeout(() => UI.loading(document.getElementById('skip'), false), 0)
}
document.getElementById('invalid').onclick = async (e) => {
    setTimeout(() => UI.loading(document.getElementById('invalid'), true, undefined, ['#f8513d', '#b52f20']), 0)
    await FIREBASE.moveFirebaseFile(UI.notes.selectedNote.elm.dataset.fullpath, `describers/bucket/invalid/${FIREBASE.user.uid}/${UI.notes.selectedNote.elm.textContent}`)
    UI.notes.refresh()
    setTimeout(() => UI.loading(document.getElementById('invalid'), false), 0)
}