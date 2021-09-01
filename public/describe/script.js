const UI={showFile(e){UI.notes.selectedNote=null,UI.loading(e.target,!0),firebase.storage().ref().child(e.target.dataset.fullpath).getDownloadURL().then(t=>{const n=new XMLHttpRequest;n.open("GET",t),n.addEventListener("readystatechange",()=>{if(4===n.readyState)try{let t=JSON.parse(n.response);UI.notes.selectedNote={elm:e.target,message:t},UI.loading(e.target,!1)}catch(t){UI.showMessage(t),UI.notes.selectedNote={elm:e.target,message:null},UI.loading(e.target,!1)}}),n.send()}).catch(t=>{UI.showMessage(t),UI.loading(e.target,!1)})},showMessage(e){document.getElementsByTagName("logger")[0].textContent+=">:"+e+"\n"},loading(e,t="toggle",n=!0,s=[]){switch(t){case!0:n&&(e.disabled=!0),s[0]&&e.style.setProperty("--color1",s[0]),s[1]&&e.style.setProperty("--color2",s[1]),e.classList.add("mine_chop_dig-loading");break;case!1:n&&(e.disabled=!1),e.classList.remove("mine_chop_dig-loading"),s[0]&&e.style.setProperty("--color1",s[0]);break;case"toggle":n&&e.classList.contains("mine_chop_dig-loading")?UI.loading(e,!1,n,s):UI.loading(e,!0,n,s)}},notes:new Proxy({selectedNote:null,allNotes:[],refresh(){previewer.value="",UI.loading(document.getElementsByTagName("nav")[0],!0),firebase.storage().ref().child(`describers/user-data/${FIREBASE.user.uid}/`).listAll().then(e=>{console.log(e),UI.notes.allNotes=e.items,UI.loading(document.getElementsByTagName("nav")[0],!1)}).catch(e=>{UI.showMessage(e),UI.loading(document.getElementsByTagName("nav")[0],!1)})}},{set:(e,t,n,s)=>{if("selectedNote"===t){if(document.querySelector("related-links").innerHTML="Related Links:",e[t]&&e[t].elm.classList.remove("selected"),n){if(console.log(n),n.elm.classList.add("selected"),previewer.value=n.messageamammessage||n.message||"Defected File.",n.messageamamhermit&&"--None--"!==n.messageamamhermit){let e=document.createElement("a");e.textContent=n.message.hermit,e.href=`https://reddit.com/r/Hermitcraft/wiki/${n.message.hermit}`,e.target="_blank",e.title=`Open ${n.message.hermit}'s wiki page in new tab`,document.querySelector("related-links").append(e)}if(n.messageamamseason&&"--None--"!==n.messageamamseason){let e=document.createElement("a");e.textContent=`Season ${n.message.season}`,e.href=`https://reddit.com/r/Hermitcraft/wiki/season_${n.message.season}`,e.target="_blank",e.title=`Open season ${n.message.season} wiki page in new tab`,document.querySelector("related-links").append(e)}document.getElementById("invalid").disabled=!1,document.getElementById("skip").disabled=!1,document.getElementById("done").disabled=!1}else previewer.value="",document.getElementById("invalid").disabled=!0,document.getElementById("skip").disabled=!0,document.getElementById("done").disabled=!0;e[t]=n}"allNotes"===t&&(e.selectedNote=null,Array.isArray(n)&&(document.getElementsByTagName("nav")[0].innerHTML="",n.forEach(e=>{let t=document.createElement("button");t.textContent=e.name,t.dataset.fullpath=e.fullPath,t.onclick=UI.showFile,document.getElementsByTagName("nav")[0].append(t)})))}})},FIREBASE={authProviders:{google:new firebase.auth.GoogleAuthProvider},async authenticate(e){UI.loading(document.getElementById("sign-in-google"),!0);try{let t=await firebase.auth().signInWithPopup(e),n=t.credential,s=(n.accessToken,t.user);document.getElementById("sign-in-google").textContent=`Sign out of ${s.displayName}`,UI.loading(document.getElementById("sign-in-google"),!1),UI.showMessage(`Successfully signed in as ${s.displayName} (${s.email})`)}catch(e){UI.loading(document.getElementById("sign-in-google"),!1),UI.showMessage(e)}},signOut(){UI.loading(document.getElementById("sign-in-google"),!0),firebase.auth().signOut().then(()=>{document.getElementById("sign-in-google").textContent="Sign in with Google",UI.notes.refresh(),UI.loading(document.getElementById("sign-in-google"),!1),UI.showMessage("Successfully signed out")}).catch(e=>{UI.loading(document.getElementById("sign-in-google"),!1),UI.showMessage(e.message)})},uploadText(e,t="application/json",n){const s=firebase.storage().ref(),o={contentType:t};let a=s.child(n||"user-gists/"+Date.now()+".json");return a.putString(e,void 0,o)},async moveFirebaseFile(e,t,n){let s="";if(n)s=n;else{let t=await firebase.storage().ref().child(e).getDownloadURL();const n=new XMLHttpRequest;n.open("GET",t,!1);try{n.send(),200!==n.status?UI.showMessage(`Error ${n.status}: ${n.statusText}`):s=n.response}catch(e){UI.showMessage(e)}}try{const n=await firebase.storage().ref().child(t).putString(s,void 0,{contentType:"application/json"});console.log(n);const o=await firebase.storage().ref().child(e).delete();console.log(o)}catch(e){UI.showMessage(e)}},user:null};let previewer=document.getElementById("file-preview");UI.loading(document.getElementById("sign-in-google"),!0),firebase.auth().onAuthStateChanged(function(e){e?(FIREBASE.user=e,document.getElementById("sign-in-google").textContent=`Sign out of ${e.displayName}`,document.getElementById("sign-in-google").onclick=(()=>{FIREBASE.signOut()}),UI.notes.refresh(),UI.loading(document.getElementById("sign-in-google"),!1)):(document.getElementById("sign-in-google").onclick=(()=>{FIREBASE.authenticate(FIREBASE.authProviders.google)}),UI.loading(document.getElementById("sign-in-google"),!1))}),document.getElementById("done").onclick=(async e=>{setTimeout(()=>UI.loading(document.getElementById("done"),!0,void 0,["#00c728","#238636"]),0),await FIREBASE.moveFirebaseFile(UI.notes.selectedNote.elm.dataset.fullpath,`describers/bucket/finished/${FIREBASE.user.uid}/${UI.notes.selectedNote.elm.textContent}`),UI.notes.refresh(),setTimeout(()=>UI.loading(document.getElementById("done"),!1),0)}),document.getElementById("skip").onclick=(async e=>{setTimeout(()=>UI.loading(document.getElementById("skip"),!0),0),await FIREBASE.moveFirebaseFile(UI.notes.selectedNote.elm.dataset.fullpath,`describers/bucket/skipped/${FIREBASE.user.uid}/${UI.notes.selectedNote.elm.textContent}`),UI.notes.refresh(),setTimeout(()=>UI.loading(document.getElementById("skip"),!1),0)}),document.getElementById("invalid").onclick=(async e=>{setTimeout(()=>UI.loading(document.getElementById("invalid"),!0,void 0,["#f8513d","#b52f20"]),0),await FIREBASE.moveFirebaseFile(UI.notes.selectedNote.elm.dataset.fullpath,`describers/bucket/invalid/${FIREBASE.user.uid}/${UI.notes.selectedNote.elm.textContent}`),UI.notes.refresh(),setTimeout(()=>UI.loading(document.getElementById("invalid"),!1),0)});