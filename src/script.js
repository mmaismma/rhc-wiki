// Start Background Animation Saga
const BACKGROUND = {
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
    scene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer(),
    theta: 0,
    init() {
        BACKGROUND.renderer.setPixelRatio(window.devicePixelRatio);
        BACKGROUND.renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector('background').appendChild(BACKGROUND.renderer.domElement);

        let boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        boxGeometry.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));

        const loader = new THREE.CubeTextureLoader();
        loader.setPath('assets/textures/ui/')
        const textureCube = loader.load([
            'panorama_3.webp',
            'panorama_1.webp',
            'panorama_5.webp', //bottom
            'panorama_4.webp', //top
            'panorama_0.webp',
            'panorama_2.webp'
        ]);

        const material = new THREE.MeshBasicMaterial({
            envMap: textureCube
        });

        let cube = new THREE.Mesh(boxGeometry, material);
        BACKGROUND.scene.add(cube);

        window.addEventListener('resize', BACKGROUND.onWindowResize, false);

    },
    onWindowResize() {
        BACKGROUND.camera.aspect = window.innerWidth / window.innerHeight;
        BACKGROUND.camera.updateProjectionMatrix();
        BACKGROUND.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
        BACKGROUND.theta += window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.0002 : 0.001;
        BACKGROUND.camera.lookAt(Math.cos(BACKGROUND.theta), -0.3, Math.sin(BACKGROUND.theta));
        BACKGROUND.renderer.render(BACKGROUND.scene, BACKGROUND.camera);

        requestAnimationFrame(BACKGROUND.animate);
    }

}

BACKGROUND.init();
BACKGROUND.animate();

// End Background Animation Saga

const FIREBASE = {
    uploadGist(data) {
        if (data.length > 2000) {
            return new Error('Data exceeds 2000 character limit');
        }
        if (data.length < 8) {
            return new Error('Information should be atleast 8 characters long');
        }
        const storageRef = firebase.storage().ref();
        const metadata = {
            contentType: 'application/json',
        };
        const message = JSON.stringify({
            'hermit': document.getElementById('hermit-picker').value,
            'season': document.getElementById('season-picker').value,
            'message': data
        })
        let user = FIREBASE.user.user ? FIREBASE.user.user.uid : 'anonymous'
        let gistRef = storageRef.child('user-gists/' + user + '/' + Date.now() + '.json');
        return gistRef.putString(message, undefined, metadata)
    },
    authProviders: {
        google: new firebase.auth.GoogleAuthProvider()
    },
    authenticate(provider) {
        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                let credential = result.credential;
                let token = credential.accessToken;
                FIREBASE.user.user = result.user;
            }).catch((error) => {
                UI.sendMessageInChat(error.message)
            });

    },
    signOut() {
        firebase.auth().signOut().then(() => {
            FIREBASE.user.user = null;
        }).catch((error) => {
            UI.sendMessageInChat(error.message)
        });
    },
    user: new Proxy({
        user: null
    }, {
        set(target, parameter, value, reciever) {
            if (parameter !== 'user') return;

            if (value) {
                target[parameter] = value;
                UI.sendMessageInChat(`Successfully signed in as ${target.user.displayName} (${target.user.email})`)
                document.getElementById('sign-in-google').textContent = `Sign out of ${target.user.displayName}`;
                document.getElementById('author').textContent = `${target.user.displayName}`;
            } else {
                target[parameter] = value;
                document.getElementById('sign-in-google').textContent = 'Sign in with Google';
                document.getElementById('author').textContent = `Anonymous`;
                UI.sendMessageInChat('Successfully signed out')
            }
        }
    })
}

// Check if user is logged in or not when window loads
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        FIREBASE.user.user = user;
        document.getElementById('sign-in-google').onclick = () => {
            FIREBASE.signOut()
        }
    } else {
        document.getElementById('sign-in-google').onclick = () => {
            FIREBASE.authenticate(FIREBASE.authProviders.google)
        }
    }
});

document.getElementById('sign-book').onclick = () => {
    setTimeout(() => document.querySelector('auto-save').style.display = '', 0)
    const response = FIREBASE.uploadGist(document.body.querySelector('.gist').value);
    if (response instanceof Error) return UI.sendMessageInChat(response);
    response.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            UI.sendMessageInChat('Upload is ' + progress + '% done');
        },
        (error) => {
            UI.sendMessageInChat(error)
            setTimeout(() => document.querySelector('auto-save').style.display = 'none', 0)
        },
        () => {
            UI.sendMessageInChat('Gist successfully sent to the server, thank you for contributing!')
            setTimeout(() => document.querySelector('auto-save').style.display = 'none', 0)
            if (!localStorage.sentNote) {
                localStorage.sentNote = true;
                let firstNoteAdv = new UI.Advancement('assets/textures/ui/icon_sign96x96.webp', null, 'Sign your first note')
                firstNoteAdv.show();
            }
        }
    );
}

const commandList = {
    describe() {
        window.location.href = 'describe'
    },
    signout() {
        FIREBASE.signOut()
    },
    signin() {
        FIREBASE.authenticate(FIREBASE.authProviders.google)
    },
    reload() {
        window.location = window.location;
    },
    clearAdvancements() {
        localStorage.removeItem('openedChat')
        localStorage.removeItem('sentNote')
    },
    jeb_() {
        document.body.classList.add('jeb_')
        UI.jeb_Interval = setInterval(() => {
            document.getElementById('theme-color-meta').content = window.getComputedStyle(document.body).outlineColor;
        }, 10)
    },
    Dinnerbone() {
        document.body.style.transform = 'rotate(180deg)'
    },
    Grumm() {
        document.body.style.transform = 'rotate(180deg)'
    },
    'effect clear': () => {
        document.body.style.transform = '';
        
        document.body.classList.remove('jeb_')
        try {
            clearInterval(UI.jeb_Interval);
        } catch {}
        UI.jeb_Interval = 0;
        document.getElementById('theme-color-meta').content = "#2bda9d";
    }
}

const UI = {
    changeScreen(toScreen, thenFn) {
        [...document.getElementsByClassName('screen')].forEach(elm => {
            elm.classList.remove('active')
        })
        document.getElementById(toScreen).classList.add('active')
        if (thenFn != false) {
            try {
                Function('"use strict";return (' + thenFn + ')')()
            } catch (error) {
                console.log(error)
            }
        }
    },
    sendMessageInChat(message) {
        let messageP = document.createElement('p')
        let messagePLive = document.createElement('p')

        messageP.innerHTML = message;
        messagePLive.innerHTML = message;

        document.getElementById('messages').append(messageP)
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
        document.getElementById('live-chat').scrollTop = document.getElementById('live-chat').scrollHeight;
        document.getElementById('live-chat').append(messagePLive)

        setTimeout(() => {
            messagePLive.style.opacity = 0;
            setTimeout(() => {
                messagePLive.remove();
            }, 1000)
        }, 5000)
    },
    toggleChatHistory(show) {
        if (show == undefined || show == null) {
            if (document.getElementById('live-chat').style.display == 'none') {
                UI.toggleChatHistory(false)
            } else {
                UI.toggleChatHistory(true)
            }
        }

        if (show === true) {
            document.getElementById('live-chat').style.display = 'none';
            document.getElementById('chat-history').style.display = '';
            document.getElementById('message-input').focus();
            if (!localStorage.openedChat) {
                localStorage.openedChat = true;
                let chatAdv = new UI.Advancement('assets/icons/chat-icon96x96.png', null, 'Open Chat');
                chatAdv.show()
            }
        }
        if (show === false) {
            document.getElementById('live-chat').style.display = '';
            document.getElementById('message-input').value = '';
            document.getElementById('chat-history').style.display = 'none';
            document.getElementById('message-input').blur();
        }

    },
    runCommand(command) {
        if (!commandList[command.slice(1)]) {
            return false;
        } else {
            commandList[command.slice(1)]();
            return true;
        }
    },
    Advancement: class {
        constructor(img, title, desc) {
            this.advBox = document.createElement('div');
            this.advBox.classList.add('advancement')

            let imgElm = img;
            if (!imgElm || typeof imgElm === "string") {
                imgElm = document.createElement('img');
                typeof img === "string" ? imgElm.src = img : null
            }
            imgElm.classList.add('icon')

            let titleElm = title;
            if (!titleElm || typeof titleElm === "string") {
                titleElm = document.createElement('div');
                titleElm.textContent = typeof title === "string" ? title : "Advancement Made!"
            }
            titleElm.classList.add('title')

            let descElm = desc;
            if (!descElm || typeof descElm === "string") {
                descElm = document.createElement('div');
                descElm.textContent = typeof desc === "string" ? desc : "Thanks for contributing"
            }
            descElm.classList.add('desc')

            this.advBox.append(imgElm);
            this.advBox.append(titleElm);
            this.advBox.append(descElm);
        }
        show() {
            document.body.append(this.advBox)
            UI.sendMessageInChat(`${FIREBASE.user.user.displayName} completed the advancement <span style="color:lime">[${this.advBox.children[2].textContent}]</span>`)
            setTimeout(() => this.advBox.style.right = '0px', 0)
            setTimeout(() => {
                this.advBox.style.right = '';
                setTimeout(() => this.advBox.remove(), 1000)
            }, 7000)
        }
    }
}

const queryList = {
    info() {
        UI.changeScreen('information')
    },
    'context-post': () => {
        console.log('hh')
        window.location.replace('https://www.reddit.com/r/HermitCraft/comments/oz3zo0/operation_improve_the_rhermitcraft_wiki_2021/')
    }
}

try {
    let queries = window.location.search.split('?')[1].split('&');
    queries.forEach(query => {
        if (queryList[query]) {
            queryList[query]();
        }
    })
} catch (err) {
    console.log(err)
}

document.onkeyup = (e) => {

    if (e.key.toLowerCase() == 't') {
        if (!(document.activeElement && ['input', 'select', 'button', 'textarea'].includes(document.activeElement.tagName.toLowerCase()))) {
            UI.toggleChatHistory()
        };
    }

    if (e.key.toLowerCase() == '/') {
        if (!(document.activeElement && ['input', 'select', 'button', 'textarea'].includes(document.activeElement.tagName.toLowerCase()))) {
            document.getElementById('message-input').value = '/';
            UI.toggleChatHistory();
        };
    }

    if (e.key == 'Enter') {
        if (document.activeElement.id === 'message-input') {
            let message = document.getElementById('message-input').value;
            if (message.length < 1) return;
            if (message.startsWith('/')) {
                if (!UI.runCommand(message)) {
                    UI.sendMessageInChat(message)
                }
            } else {
                UI.sendMessageInChat(message)
            }
            document.getElementById('message-input').value = '';
        }
    }

    if (e.key == 'Escape') {
        if (document.getElementById('live-chat').style.display == 'none') {
            UI.toggleChatHistory(false)
        }
    }
}

document.getElementById('send-message').onclick = () => {
    let message = document.getElementById('message-input').value;
    if (message.length < 1) return;
    if (message.startsWith('/')) {
        if (!UI.runCommand(message)) {
            UI.sendMessageInChat(message)
        }
    } else {
        UI.sendMessageInChat(message)
    }
    document.getElementById('message-input').value = '';
}

document.getElementById('close-chat-history').onclick = () => {
    UI.toggleChatHistory(false)
}

document.getElementById('open-chat').onclick = () => {
    UI.toggleChatHistory(true)
}

[...document.getElementsByClassName('change-screen')].forEach(elm => {
    elm.onclick = () => {
        const screenId = elm.dataset.toScreen.split(' ')[0];
        const thenFn = elm.dataset.toScreen.split(' ').slice(1).join(' ');

        UI.changeScreen(screenId, thenFn)
    }
})
UI.sendMessageInChat('Press "T" or "Open Chat" to open chat')

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js', {
        scope: './'
    });
}