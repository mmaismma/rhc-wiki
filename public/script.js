const BACKGROUND={camera:new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),scene:new THREE.Scene,renderer:new THREE.WebGLRenderer,theta:0,init(){BACKGROUND.renderer.setPixelRatio(window.devicePixelRatio),BACKGROUND.renderer.setSize(window.innerWidth,window.innerHeight),document.querySelector("background").appendChild(BACKGROUND.renderer.domElement);let e=new THREE.BoxGeometry(1,1,1);e.applyMatrix4((new THREE.Matrix4).makeScale(-1,1,1));const t=new THREE.CubeTextureLoader;t.setPath("assets/textures/ui/");const n=t.load(["panorama_3.webp","panorama_1.webp","panorama_5.webp","panorama_4.webp","panorama_0.webp","panorama_2.webp"]),o=new THREE.MeshBasicMaterial({envMap:n});let s=new THREE.Mesh(e,o);BACKGROUND.scene.add(s),window.addEventListener("resize",BACKGROUND.onWindowResize,!1)},onWindowResize(){BACKGROUND.camera.aspect=window.innerWidth/window.innerHeight,BACKGROUND.camera.updateProjectionMatrix(),BACKGROUND.renderer.setSize(window.innerWidth,window.innerHeight)},animate(){BACKGROUND.theta+=window.matchMedia("(prefers-reduced-motion: reduce)").matches?2e-4:.001,BACKGROUND.camera.lookAt(Math.cos(BACKGROUND.theta),-.3,Math.sin(BACKGROUND.theta)),BACKGROUND.renderer.render(BACKGROUND.scene,BACKGROUND.camera),requestAnimationFrame(BACKGROUND.animate)}};BACKGROUND.init(),BACKGROUND.animate();const FIREBASE={uploadGist(e){if(e.length>2e3)return new Error("Data exceeds 2000 character limit");if(e.length<8)return new Error("Information should be atleast 8 characters long");const t=firebase.storage().ref(),n={contentType:"application/json"},o=JSON.stringify({hermit:document.getElementById("hermit-picker").value,season:document.getElementById("season-picker").value,message:e});let s=FIREBASE.user.user?FIREBASE.user.user.uid:"anonymous",a=t.child("user-gists/"+s+"/"+Date.now()+".json");return a.putString(o,void 0,n)},authProviders:{google:new firebase.auth.GoogleAuthProvider},authenticate(e){firebase.auth().signInWithPopup(e).then(e=>{let t=e.credential;t.accessToken;FIREBASE.user.user=e.user}).catch(e=>{UI.sendMessageInChat(e.message)})},signOut(){firebase.auth().signOut().then(()=>{FIREBASE.user.user=null}).catch(e=>{UI.sendMessageInChat(e.message)})},user:new Proxy({user:null},{set(e,t,n,o){"user"===t&&(n?(e[t]=n,UI.sendMessageInChat(`Successfully signed in as ${e.user.displayName} (${e.user.email})`),document.getElementById("sign-in-google").textContent=`Sign out of ${e.user.displayName}`,document.getElementById("author").textContent=`${e.user.displayName}`):(e[t]=n,document.getElementById("sign-in-google").textContent="Sign in with Google",document.getElementById("author").textContent="Anonymous",UI.sendMessageInChat("Successfully signed out")))}})};firebase.auth().onAuthStateChanged(function(e){e?(FIREBASE.user.user=e,document.getElementById("sign-in-google").onclick=(()=>{FIREBASE.signOut()})):document.getElementById("sign-in-google").onclick=(()=>{FIREBASE.authenticate(FIREBASE.authProviders.google)})}),document.getElementById("sign-book").onclick=(()=>{setTimeout(()=>document.querySelector("auto-save").style.display="",0);const e=FIREBASE.uploadGist(document.body.querySelector(".gist").value);if(e instanceof Error)return UI.sendMessageInChat(e);e.on(firebase.storage.TaskEvent.STATE_CHANGED,e=>{let t=e.bytesTransferred/e.totalBytes*100;UI.sendMessageInChat("Upload is "+t+"% done")},e=>{UI.sendMessageInChat(e),setTimeout(()=>document.querySelector("auto-save").style.display="none",0)},()=>{if(UI.sendMessageInChat("Gist successfully sent to the server, thank you for contributing!"),setTimeout(()=>document.querySelector("auto-save").style.display="none",0),!localStorage.sentNote){localStorage.sentNote=!0;let e=new UI.Advancement("assets/textures/ui/icon_sign96x96.webp",null,"Sign your first note");e.show()}})});const commandList={describe(){window.location.href="describe"},signout(){FIREBASE.signOut()},signin(){FIREBASE.authenticate(FIREBASE.authProviders.google)},reload(){window.location=window.location},clearAdvancements(){localStorage.removeItem("openedChat"),localStorage.removeItem("sentNote")},jeb_(){document.body.classList.add("jeb_"),UI.jeb_Interval=setInterval(()=>{document.getElementById("theme-color-meta").content=window.getComputedStyle(document.body).outlineColor},10)},Dinnerbone(){document.body.style.transform="rotate(180deg)"},Grumm(){document.body.style.transform="rotate(180deg)"},"effect clear":()=>{document.body.style.transform="",document.body.classList.remove("jeb_");try{clearInterval(UI.jeb_Interval)}catch{}UI.jeb_Interval=0,document.getElementById("theme-color-meta").content="#2bda9d"}},UI={changeScreen(e,t){if([...document.getElementsByClassName("screen")].forEach(e=>{e.classList.remove("active")}),document.getElementById(e).classList.add("active"),0!=t)try{Function('"use strict";return ('+t+")")()}catch(e){console.log(e)}},sendMessageInChat(e){let t=document.createElement("p"),n=document.createElement("p");t.innerHTML=e,n.innerHTML=e,document.getElementById("messages").append(t),document.getElementById("messages").scrollTop=document.getElementById("messages").scrollHeight,document.getElementById("live-chat").scrollTop=document.getElementById("live-chat").scrollHeight,document.getElementById("live-chat").append(n),setTimeout(()=>{n.style.opacity=0,setTimeout(()=>{n.remove()},1e3)},5e3)},toggleChatHistory(e){if(null!=e&&null!=e||("none"==document.getElementById("live-chat").style.display?UI.toggleChatHistory(!1):UI.toggleChatHistory(!0)),!0===e&&(document.getElementById("live-chat").style.display="none",document.getElementById("chat-history").style.display="",document.getElementById("message-input").focus(),!localStorage.openedChat)){localStorage.openedChat=!0;let e=new UI.Advancement("assets/icons/chat-icon96x96.png",null,"Open Chat");e.show()}!1===e&&(document.getElementById("live-chat").style.display="",document.getElementById("message-input").value="",document.getElementById("chat-history").style.display="none",document.getElementById("message-input").blur())},runCommand:e=>!!commandList[e.slice(1)]&&(commandList[e.slice(1)](),!0),Advancement:class{constructor(e,t,n){this.advBox=document.createElement("div"),this.advBox.classList.add("advancement");let o=e;o&&"string"!=typeof o||(o=document.createElement("img"),"string"==typeof e&&(o.src=e)),o.classList.add("icon");let s=t;s&&"string"!=typeof s||(s=document.createElement("div"),s.textContent="string"==typeof t?t:"Advancement Made!"),s.classList.add("title");let a=n;a&&"string"!=typeof a||(a=document.createElement("div"),a.textContent="string"==typeof n?n:"Thanks for contributing"),a.classList.add("desc"),this.advBox.append(o),this.advBox.append(s),this.advBox.append(a)}show(){document.body.append(this.advBox),UI.sendMessageInChat(`${FIREBASE.user.user.displayName} completed the advancement <span style="color:lime">[${this.advBox.children[2].textContent}]</span>`),setTimeout(()=>this.advBox.style.right="0px",0),setTimeout(()=>{this.advBox.style.right="",setTimeout(()=>this.advBox.remove(),1e3)},7e3)}}},queryList={info(){UI.changeScreen("information")},"context-post":()=>{console.log("hh"),window.location.replace("https://www.reddit.com/r/HermitCraft/comments/oz3zo0/operation_improve_the_rhermitcraft_wiki_2021/")}};try{let e=window.location.search.split("?")[1].split("&");e.forEach(e=>{queryList[e]&&queryList[e]()})}catch(e){console.log(e)}document.onkeyup=(e=>{if("t"==e.key.toLowerCase()&&(document.activeElement&&["input","select","button","textarea"].includes(document.activeElement.tagName.toLowerCase())||UI.toggleChatHistory()),"/"==e.key.toLowerCase()&&(document.activeElement&&["input","select","button","textarea"].includes(document.activeElement.tagName.toLowerCase())||(document.getElementById("message-input").value="/",UI.toggleChatHistory())),"Enter"==e.key&&"message-input"===document.activeElement.id){let e=document.getElementById("message-input").value;if(e.length<1)return;e.startsWith("/")&&UI.runCommand(e)||UI.sendMessageInChat(e),document.getElementById("message-input").value=""}"Escape"==e.key&&"none"==document.getElementById("live-chat").style.display&&UI.toggleChatHistory(!1)}),document.getElementById("send-message").onclick=(()=>{let e=document.getElementById("message-input").value;e.length<1||(e.startsWith("/")&&UI.runCommand(e)||UI.sendMessageInChat(e),document.getElementById("message-input").value="")}),document.getElementById("close-chat-history").onclick=(()=>{UI.toggleChatHistory(!1)}),document.getElementById("open-chat").onclick=(()=>{UI.toggleChatHistory(!0)}),[...document.getElementsByClassName("change-screen")].forEach(e=>{e.onclick=(()=>{const t=e.dataset.toScreen.split(" ")[0],n=e.dataset.toScreen.split(" ").slice(1).join(" ");UI.changeScreen(t,n)})}),UI.sendMessageInChat('Press "T" or "Open Chat" to open chat'),"serviceWorker"in navigator&&navigator.serviceWorker.register("service-worker.js",{scope:"./"});