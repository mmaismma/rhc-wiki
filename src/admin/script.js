//,1629931566004.json,1628950414367.json,1628599096385.json,1628685406436.json,1629013734144.json,1629121231273.json,1629202032538.json,1629375491470.json,1629452295506.json,1629452318877.json,1629630416932.json,1629976015731.json,1629981236454.json,1630236203665.json,1629026408705.json,1629721608758.json,1628676952825.json,1629069313130.json,1629222442965.json,1628445112592.json,1628445285179.json,1628576195976.json,1628576751706.json,1628651595618.json,1630674506518.json,1630674514400.json,1628611692463.json,1630851781259.json,1628802226809.json,1628965545749.json,1628705431298.json,1630075376655.json,1628953077338.json,1629676870127.json,1629933426865.json,1630884912122.json,1628853918108.json,1628898556629.json,1628636863941.json,1628792713985.json,1628905873081.json,1629224746590.json,1629594906509.json,1629645968254.json,1629833877882.json,1628966887149.json,1628954361877.json,1628869759532.json,1628601647993.json,1629392276362.json,1629477866701.json,1629639552022.json,1629667423210.json,1629924165592.json,1630249225945.json,1630443274222.json,1630443546080.json,1630615074819.json,1630771771551.json,1627923997175.json,1628315898861.json,1628438780507.json,1628469683642.json,1628801214802.json,1628843039575.json,1628843049348.json,1631044824244.json,1631027555927.json,1631025777776.json,1628651706085.json,1628742638275.json,1628743068482.json,1628765626128.json,1628765780064.json,1628766305320.json,1628766577047.json,1628767051867.json,1628767503023.json,1628767972534.json,1628768300049.json,1628768404262.json,1628831095574.json,1628870224339.json,1628870237870.json,1629034510205.json,1629035760378.json,1629036175307.json,1629045216200.json,1629045672806.json,1629055606456.json,1629056947947.json,1629058289998.json,1629145070224.json,1629598935027.json,1629599246407.json,1629599342661.json,1629599427310.json,1629599495676.json,1629599803987.json
const $ = (x) => document.querySelector(x);
const previewer = $('#previewer')

let path = 'user-gists/';

const updateDimNotes = () => {
    localStorage.getItem('dimNotes')?.split(',').forEach(dimNote => {
        [...document.querySelectorAll(`[data-name="${dimNote}"`)].forEach(elm => elm.classList.add('dimmed'))
    })
    console.log('akak');
}
updateDimNotes()

const UI = {
    showFile(e) {
        UI.notes.selectedNote = null;
        UI.loading(e.target, true);

        if (e.target.dataset.type === 'folder') {
            firebase.storage().ref().child(`${e.target.dataset.fullpath}/`).listAll().then(result => {
                console.log(result)
                UI.notes.allNotes = result;
                path = `${e.target.dataset.fullpath}/`
                UI.loading($('nav items'), false)
            }).catch(error => {
                console.log(error)
                UI.loading($('nav items'), false)
            })
        }
        if (e.target.dataset.type === 'file') {
            firebase.storage().ref().child(e.target.dataset.fullpath).getDownloadURL().then(url => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url)
                xhr.addEventListener('readystatechange', () => {
                    if (xhr.readyState === 4) {
                        try {
                            let json = JSON.parse(xhr.response);
                            UI.notes.selectedNote = {
                                elm: e.target,
                                message: json,
                                path: e.target.dataset.fullpath,
                                name: e.target.textContent
                            };
                            UI.loading(e.target, false)
                        } catch (error) {
                            console.log(error)
                            UI.notes.selectedNote = {
                                elm: e.target,
                                message: null,
                                path: e.target.dataset.fullpath,
                                name: e.target.textContent
                            };
                            UI.loading(e.target, false)
                        }
                    }
                })
                xhr.send();

            }).catch(error => {
                console.log(error)
                UI.loading(e.target, false)
            })
        }
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
        allSelectedNotes: [],
        allNotes: [],
        refresh() {
            previewer.value = '';
            UI.loading($('nav items'), true)
            firebase.storage().ref().child(path).listAll().then(result => {
                console.log(result)
                UI.notes.allNotes = result;
                UI.loading($('nav items'), false)
            }).catch(error => {
                console.log(error)
                UI.loading($('nav items'), false)
            })
        }
    }, {
        set: (target, property, value, reciever) => {
            if (property === 'selectedNote') {
                $('related-links').innerHTML = 'Related Links:';
                if (target[property]) {
                    target[property].elm.classList.remove('selected')
                }
                [...$('describers').children].forEach(elm => elm.style.backgroundColor = '')
                if (value) {
                    console.log(value);
                    value.elm.classList.add('selected')
                    previewer.value = value.message?.message || value.message || 'Defected File.';

                    if (value.message?.hermit && value.message?.hermit !== '--None--') {
                        [...$('describers').children].forEach(elm => {
                            elm.children[0].title.split(',').forEach(x => {
                                if (x.trim().toLowerCase() === value.message.hermit.trim().toLowerCase()) {
                                    elm.style.backgroundColor = 'lime';
                                }
                            })
                        })

                        let hermitButton = document.createElement('a');
                        hermitButton.textContent = value.message.hermit;
                        hermitButton.href = `https://reddit.com/r/Hermitcraft/wiki/${value.message.hermit}`;
                        hermitButton.target = '_blank';
                        hermitButton.title = `Open ${value.message.hermit}'s wiki page in new tab`;
                        $('related-links').append(hermitButton)
                    }
                    if (value.message?.season && value.message?.season !== '--None--') {
                        let seasonButton = document.createElement('a');
                        seasonButton.textContent = `Season ${value.message.season}`;
                        seasonButton.href = `https://reddit.com/r/Hermitcraft/wiki/season_${value.message.season}`;
                        seasonButton.target = '_blank';
                        seasonButton.title = `Open season ${value.message.season} wiki page in new tab`;
                        $('related-links').append(seasonButton)
                    }
                    $('#move').disabled = false;
                    $('#copy').disabled = false;
                    $('#dim').disabled = false;
                } else {
                    previewer.value = '';
                    $('#move').disabled = true;
                    $('#copy').disabled = true;
                    $('#dim').disabled = true;
                }
                target[property] = value;
            }
            if (property === 'allNotes') {
                target.selectedNote = null;
                $('nav items').innerHTML = '';

                value.prefixes.forEach(folder => {
                    let tempButton = document.createElement('button');
                    tempButton.textContent = folder.name;
                    tempButton.dataset.type = 'folder';
                    tempButton.dataset.fullpath = folder.fullPath;
                    tempButton.onclick = UI.showFile;
                    $('nav items').append(tempButton);
                });

                value.items.forEach(file => {
                    let tempButton = document.createElement('button');
                    tempButton.textContent = file.name;
                    tempButton.dataset.type = 'file';
                    tempButton.dataset.fullpath = file.fullPath;
                    tempButton.dataset.name = file.name;
                    tempButton.onclick = e => {
                        if (e.altKey) {
                            let dimNotes = localStorage.getItem('dimNotes')
                            if (dimNotes.split(',').includes(e.target.dataset.name)) {
                                dimNotes = dimNotes.split(',')
                                dimNotes.splice(dimNotes.indexOf(e.target.dataset.name), 1);
                                localStorage.setItem('dimNotes', dimNotes.join())
                                e.target.classList.remove('dimmed')
                            } else {
                                localStorage.setItem('dimNotes', dimNotes + `,${e.target.dataset.name}`)
                            }
                            updateDimNotes()
                        } else if (e.ctrlKey) {
                            UI.allSelectedNotes.push(e.target.name)
                        } else {
                            UI.showFile(e);
                        }
                    }
                    $('nav items').append(tempButton);
                });
                updateDimNotes()
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
        } catch (error) {
            console.log(error)
            UI.loading($('#sign-in-google'), false)
        }

    },
    signOut() {
        UI.loading($('#sign-in-google'), true)
        firebase.auth().signOut().then(() => {
            $('#sign-in-google').textContent = 'Sign in with Google';
            UI.notes.refresh();
            UI.loading($('#sign-in-google'), false)
        }).catch((error) => {
            UI.loading($('#sign-in-google'), false)
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
    async moveFirebaseFile(currentPath, destinationPath, operation = 'move') {
        let message = '';
        if (operation !== 'move' && operation !== 'copy') {
            message = operation;
        } else {
            let url = await firebase.storage().ref().child(currentPath).getDownloadURL()
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false)
            try {
                xhr.send();
                if (xhr.status !== 200) {
                    console.log(`Error ${xhr.status}: ${xhr.statusText}`)
                } else {
                    message = xhr.response;
                }
            } catch (error) {
                console.log(error)
            }
        }
        console.log(operation);
        console.log(message);
        try {
            const putStringStatus = await firebase.storage().ref().child(destinationPath).putString(message, undefined, {contentType: 'application/json'});
            console.log(putStringStatus);
            if (operation === 'move') {
                const deleteStatus = await firebase.storage().ref().child(currentPath).delete()
                console.log(deleteStatus)
            }
        } catch (error) {
            console.log(error);
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

$('#move').onclick = async () => {
    setTimeout(() => UI.loading($('#move'), true, undefined), 0)

    let checkedDescribers = [];
    [...$('describers').children].forEach(elm => {
        if (elm.checked) checkedDescribers.push(elm.dataset.authId);
    })
    
    checkedDescribers.forEach(describer => {
        FIREBASE.moveFirebaseFile(null, `describers/user-data/${describer}/${UI.notes.selectedNote.name}`, JSON.stringify(UI.notes.selectedNote.message))
    })
    const deleteStatus = await firebase.storage().ref().child(UI.notes.selectedNote.path).delete();
    console.log(deleteStatus)

    UI.notes.refresh()
    setTimeout(() => UI.loading($('#move'), false), 0)
}

$('#copy').onclick = async () => {
    setTimeout(() => UI.loading($('#copy'), true, undefined), 0)
    
    let checkedDescribers = [];
    [...$('describers').children].forEach(elm => {
        if (elm.children[0].checked) checkedDescribers.push(elm.children[0].dataset.authId);
    })
    console.log(checkedDescribers)
    // for (let i = 0; i < checkedDescribers.length; i++) {
    //     const describer = checkedDescribers[i];
    //     console.log('inside copy1.5')
    //     await FIREBASE.moveFirebaseFile(null, `describers/user-data/${describer}/${UI.notes.selectedNote.name}`, JSON.stringify(UI.notes.selectedNote.message))
    //     console.log('inside copy1.75')
    // }
    checkedDescribers.forEach(async describer => {
        console.log('inside copy1.5')
        await FIREBASE.moveFirebaseFile(null, `describers/user-data/${describer}/${UI.notes.selectedNote.name}`, JSON.stringify(UI.notes.selectedNote.message))
        console.log('inside copy1.75')
    })
    console.log('inside copy2')

    UI.notes.refresh()
    setTimeout(() => UI.loading($('#copy'), false), 0)
}

$('#dim').onclick = () => {
    let dimNotes = localStorage.getItem('dimNotes')
    if (dimNotes.split(',').includes(UI.notes.selectedNote.elm.dataset.name)) {
        dimNotes = dimNotes.split(',')
        dimNotes.splice(dimNotes.indexOf(UI.notes.selectedNote.elm.dataset.name), 1);
        localStorage.setItem('dimNotes', dimNotes.join())
        UI.notes.selectedNote.elm.classList.remove('dimmed')
    } else {
        localStorage.setItem('dimNotes', dimNotes + `,${UI.notes.selectedNote.elm.dataset.name}`)
    }
    updateDimNotes()
}

$('#update-dimmed-notes').onclick = () => {
    let oldHistory = localStorage.getItem('dimNotes')

    localStorage.setItem('dimNotes', previewer.value)

    previewer.value = oldHistory;
}