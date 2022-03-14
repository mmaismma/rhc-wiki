const $ = (x, all) => {
    if (all) return document.querySelectorAll(x, true);
    return document.querySelector(x)
}

const UI = {
    showFile(e) {
        UI.notes.selectedNote = null;
        UI.loading(e.target, true);

        let sessionData = sessionStorage.getItem(e.target.dataset.fullpath)
        if (sessionData) {
            UI.notes.selectedNote = {
                elm: e.target,
                message: sessionData
            };
            UI.loading(e.target, false)
        } else {
            FIREBASE.getFile(e.target.dataset.fullpath).then(value => {
                UI.notes.selectedNote = {
                    elm: e.target,
                    message: value
                };
                UI.loading(e.target, false)
            }).catch(error => {
                UI.showMessage(error)
                UI.notes.selectedNote = {
                    elm: e.target,
                    message: null
                };
                UI.loading(e.target, false)
            })
        }
    },
    showMessage(msg) {
        $('logger').textContent += '>' + msg + '\n';
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
    hideParameters: ["mmaismma"],
    toggleNoteVisibility: {
        update(parameter, visible) {
            if (visible) {
                UI.hideParameters.splice(UI.hideParameters.indexOf(parameter), 1);
            } else {
                UI.hideParameters.push(parameter);
            }
            [...$('#notes-holder').children].forEach(elm => {
                for (let i = 0; i < UI.hideParameters.length; i++) {
                    if ([...$(UI.hideParameters[i], true)].includes(elm)) {
                        elm.style.display = 'none';
                        break;
                    }
                    elm.style.display = '';
                }
            })
        }
    },
    updateNoteFormattings() {
        let currentYellows = localStorage.getItem('describer-yellowed') || '';
        currentYellows = currentYellows.split(',');

        let currentPinks = localStorage.getItem('describer-pinked') || '';
        currentPinks = currentPinks.split(',');
        UI.currentYellows = currentYellows.join();
        UI.currentPinks = currentPinks.join();

        [...$('#notes-holder').children].forEach(x => {
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
        })
    },
    currentYellows: localStorage.getItem('describer-yellowed') || '',
    currentPinks: localStorage.getItem('describer-pinked') || '',
    notes: new Proxy({
        selectedNote: null,
        allNotes: [],
        refresh() {
            $('#file-preview').value = '';
            UI.loading($('#notes-holder'), true)
            firebase.storage().ref().child(`/notes/`).listAll().then(result => {
                UI.notes.allNotes = result.items;
                UI.loading($('#notes-holder'), false)
            }).catch(error => {
                UI.showMessage(error)
                UI.loading($('#notes-holder'), false)
            })
        }
    }, {
        set: (target, property, value, reciever) => {
            if (property === 'selectedNote') {
                if (target[property]) {
                    target[property].elm.classList.remove('selected')
                }

                if (value) {
                    value.elm.classList.add('selected')
                    $('#file-preview').value = value.message ?? '<<Hmm, looks like something blew up or this is a defected file>>';
                    sessionStorage.setItem(value.elm.dataset.fullpath, value.message)
                } else {
                    $('#file-preview').value = '';
                }
                target[property] = value;
            }
            if (property === 'allNotes') {
                target.selectedNote = null;
                if (Array.isArray(value)) {
                    $('#notes-holder').innerHTML = '';
                    value.forEach(async file => {
                        
                        let metadata = await firebase.storage().ref().child(file.fullPath).getMetadata();
                        
                        let hermit = metadata.customMetadata.hermit;
                        let season = "S"+metadata.customMetadata.season;
                        let informer = "I"+metadata.customMetadata.informer;

                        let tempButton = document.createElement('button');
                        tempButton.textContent = file.name;
                        tempButton.dataset.hermit = hermit;
                        tempButton.dataset.season = season;
                        tempButton.dataset.informer = informer;
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

                        if (!$(`[data-toggle-hermit=${hermit}]`)) {
                            let tempInput = document.createElement('label')
                            tempInput.innerHTML = `<input type="checkbox" checked data-toggle-hermit="${hermit}" oninput="javascript: UI.toggleNoteVisibility.update('[data-hermit='+this.dataset.toggleHermit+']', this.checked)">${hermit}`
                            $('#hermit-hider').append(tempInput)
                        }
                        if (!$(`[data-toggle-season=${season}]`)) {
                            let tempInput = document.createElement('label')
                            tempInput.innerHTML = `<input type="checkbox" checked data-toggle-season="${season}" oninput="javascript: UI.toggleNoteVisibility.update('[data-season='+this.dataset.toggleSeason+']', this.checked)">${season}`
                            $('#season-hider').append(tempInput)
                        }
                        if (!$(`[data-toggle-informer=${informer}]`)) {
                            let tempInput = document.createElement('label')
                            tempInput.innerHTML = `<input type="checkbox" checked data-toggle-informer="${informer}" oninput="javascript: UI.toggleNoteVisibility.update('[data-informer='+this.dataset.toggleInformer+']', this.checked)">${informer}`
                            $('#informer-hider').append(tempInput)
                        }
                        $('#notes-holder').append(tempButton);
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
    user: null,
    async getFile(path) {
        const url = await firebase.storage().ref().child(path).getDownloadURL()
        const value = await fetch(url)

        if (value.ok) {
            return value.text();
        } else {
            throw new Error(`There is an error with this file, status: ${value.status}`)
        }
    }
}


UI.loading($('#sign-in-google'), true)
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        FIREBASE.user = user;
        $('#sign-in-google').textContent = `Sign out of ${user.displayName}`
        $('#sign-in-google').onclick = () => {
            FIREBASE.signOut()
        }
        UI.loading($('#sign-in-google'), false)
    } else {
        $('#sign-in-google').onclick = () => {
            FIREBASE.authenticate(FIREBASE.authProviders.google)
        }
        UI.loading($('#sign-in-google'), false)
    }
    UI.notes.refresh()
});
