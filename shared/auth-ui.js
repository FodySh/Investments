/**
 * shared/auth-ui.js
 * Auth UI helpers: updateUI, sign-in/out, demo auth, menus.
 *
 * Depends on: shared/firebase-init.js, shared/toast.js
 *
 * Globals exposed:
 *   _updateUI(), googleSignIn(), googleSignOut(),
 *   demoSignIn(), demoSignOut(),
 *   toggleDesktopUserMenu(), toggleMobUserMenu(), closeMobUserMenu()
 */

/* ---------- Update UI after auth state change ---------- */

function _updateUI(user) {
  function el(id)    { return document.getElementById(id); }
  function show(id,d){ var e=el(id); if(e) e.style.display=d; }
  function text(id,v){ var e=el(id); if(e) e.textContent=v; }
  function html(id,v){ var e=el(id); if(e) e.innerHTML=v; }

  if (user) {
    var name  = user.displayName || "User";
    var first = name.split(" ")[0];
    var p     = user.photoURL;
    var img   = function(s) {
      return p
        ? "<img src='"+p+"' style='width:"+s+"px;height:"+s+"px;border-radius:50%;object-fit:cover' referrerpolicy='no-referrer'/>"
        : name[0];
    };
    show("auth-signin-btn","none");
    var uc=el("auth-user-card"); if(uc) uc.classList.add("show");
    text("auth-user-name",  name);
    text("auth-user-email", user.email||"");
    html("auth-avatar-initials", img(32));
    show("mob-signin-btn","none");
    show("mob-user-card","flex");
    text("mob-user-name",  first);
    text("mob-menu-email", user.email||"");
    html("mob-avatar", img(30));
    // Update topbar user name (debts.html style)
    var mobName = el("mob-user-name");
    if (mobName) mobName.style.display = "block";
    _gate(false);
    if (typeof showToast === "function") showToast("Welcome " + first);
  } else {
    show("auth-signin-btn","flex");
    var uc2=el("auth-user-card"); if(uc2) uc2.classList.remove("show");
    var bd=el("sync-badge"); if(bd) bd.style.display="none";
    show("mob-signin-btn","flex");
    show("mob-user-card","none");
  }
}

/* ---------- Google sign-in / sign-out ---------- */

window.googleSignIn = function() {
  if (!_auth || !_provider) { demoSignIn(); return; }
  _auth.signInWithPopup(_provider).then(function(result) {
    // success handled by onAuthStateChanged
  }).catch(function(e) {
    if (e.code === "auth/popup-blocked") {
      if (typeof showToast === "function")
        showToast("Please allow popups for this site");
    } else if (e.code !== "auth/popup-closed-by-user"
            && e.code !== "auth/cancelled-popup-request") {
      console.error("SignIn error:", e.code, e.message);
      if (typeof showToast === "function")
        showToast("Login failed: " + e.code);
    }
  });
};

window.googleSignOut = function() {
  if (!_auth) { demoSignOut(); return; }
  _auth.signOut().then(function() {
    if (typeof showToast === "function") showToast("Signed out");
    if (typeof closeMobUserMenu === "function") closeMobUserMenu();
  });
};

/* ---------- Demo auth (when Firebase is not configured) ---------- */

function demoSignIn() {
  var name = '\u0641\u0647\u062F';
  var email = 'fahad@example.com';
  var signinBtn = document.getElementById('auth-signin-btn');
  var userCard  = document.getElementById('auth-user-card');
  if (signinBtn) signinBtn.style.display = 'none';
  if (userCard)  userCard.classList.add('show');
  var nameEl   = document.getElementById('auth-user-name');
  var emailEl  = document.getElementById('auth-user-email');
  var initials = document.getElementById('auth-avatar-initials');
  if (nameEl)   nameEl.textContent   = name;
  if (emailEl)  emailEl.textContent  = email;
  if (initials) initials.textContent = '\u0641';
  var mobSignin = document.getElementById('mob-signin-btn');
  var mobUser   = document.getElementById('mob-user-card');
  var mobAvatar = document.getElementById('mob-avatar');
  var mobName   = document.getElementById('mob-user-name');
  var mobEmail  = document.getElementById('mob-menu-email');
  if (mobSignin) mobSignin.style.display = 'none';
  if (mobUser)   mobUser.style.display   = 'flex';
  if (mobAvatar) mobAvatar.textContent   = '\u0641';
  if (mobName)   mobName.textContent     = name;
  if (mobEmail)  mobEmail.textContent    = email;
  showToast('\u2705 \u0648\u0636\u0639 \u062A\u062C\u0631\u064A\u0628\u064A \u2014 \u0633\u062C\u0651\u0644 Firebase \u0644\u062A\u0641\u0639\u064A\u0644 Google');
}

function demoSignOut() {
  var signinBtn = document.getElementById('auth-signin-btn');
  var userCard  = document.getElementById('auth-user-card');
  if (signinBtn) signinBtn.style.display = 'flex';
  if (userCard)  userCard.classList.remove('show');
  var mobSignin = document.getElementById('mob-signin-btn');
  var mobUser   = document.getElementById('mob-user-card');
  if (mobSignin) mobSignin.style.display = 'flex';
  if (mobUser)   mobUser.style.display   = 'none';
  if (typeof closeMobUserMenu === 'function') closeMobUserMenu();
  showToast('\uD83D\uDC4B \u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C');
}

if (!window.googleSignIn) window.googleSignIn = demoSignIn;
if (!window.googleSignOut) window.googleSignOut = demoSignOut;

/* ---------- Desktop user menu ---------- */

function toggleDesktopUserMenu() {
  var menu = document.getElementById('desktop-user-menu');
  if (!menu) return;
  var open = menu.style.display === 'block';
  menu.style.display = open ? 'none' : 'block';
}

document.addEventListener('click', function(e) {
  var menu = document.getElementById('desktop-user-menu');
  if (!menu || menu.style.display !== 'block') return;
  var avatar = document.getElementById('auth-avatar-initials');
  if (!menu.contains(e.target) && (!avatar || !avatar.contains(e.target))) {
    menu.style.display = 'none';
  }
});

/* ---------- Mobile user menu ---------- */

function toggleMobUserMenu() {
  var menu    = document.getElementById('mob-user-menu');
  var overlay = document.getElementById('mob-user-overlay');
  if (!menu) return;
  var isOpen = menu.style.display === 'block';
  if (isOpen) { closeMobUserMenu(); }
  else {
    menu.style.display    = 'block';
    if (overlay) overlay.style.display = 'block';
  }
}

function closeMobUserMenu() {
  var menu    = document.getElementById('mob-user-menu');
  var overlay = document.getElementById('mob-user-overlay');
  if (menu)    menu.style.display    = 'none';
  if (overlay) overlay.style.display = 'none';
}
