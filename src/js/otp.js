// ============================================================
//  otp.js  —  Firebase Phone OTP Verification for VoteChain
//  Loaded in vote.html BEFORE app.js
// ============================================================

// ── STEP 1: Firebase config ──────────────────────────────────
// Replace these values with your own Firebase project credentials.
// Get them from: Firebase Console → Project Settings → Your apps → Web app
var firebaseConfig = {
  apiKey: "AIzaSyD8_igutR7VxVUGa0MFM3SvrXMc1-J2PQI",
  authDomain: "votechain-a8815.firebaseapp.com",
  projectId: "votechain-a8815",
  storageBucket: "votechain-a8815.firebasestorage.app",
  messagingSenderId: "834022215487",
  appId: "1:834022215487:web:a090822e0cb51fcbde0d8a"
};

// ── STEP 2: Initialize Firebase ──────────────────────────────
firebase.initializeApp(firebaseConfig);
var firebaseAuth = firebase.auth();

// ── STEP 3: Global OTP state ─────────────────────────────────
var OTP = {
  confirmationResult: null,
  verified: false,
  verifiedPhone: null,
  recaptchaVerifier: null,
  timerInterval: null,

  showModal: function () {
    document.getElementById("otp-overlay").style.display = "flex";
    OTP.setupRecaptcha();
  },

  hideModal: function () {
    document.getElementById("otp-overlay").style.display = "none";
  },

  setupRecaptcha: function () {
    if (OTP.recaptchaVerifier) return;
    OTP.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("otp-recaptcha", {
      size: "invisible",
      callback: function () { }
    });
  },

  sendOTP: function () {
    var phoneInput = document.getElementById("otp-phone").value.trim().replace(/\s/g, "");
    var countryCode = document.getElementById("otp-country-code").value;

    if (!/^\d{10}$/.test(phoneInput)) {
      OTP.showError("Please enter a valid 10-digit mobile number.");
      return;
    }

    var fullPhone = countryCode + phoneInput;
    OTP.showStep("sending");

    firebaseAuth.signInWithPhoneNumber(fullPhone, OTP.recaptchaVerifier)
      .then(function (confirmationResult) {
        OTP.confirmationResult = confirmationResult;
        OTP.showStep("enter-otp");
        OTP.showSuccess("OTP sent to " + fullPhone);
        OTP.startTimer(60);
      })
      .catch(function (error) {
        console.error("Send OTP error:", error);
        OTP.recaptchaVerifier.clear();
        OTP.recaptchaVerifier = null;
        OTP.setupRecaptcha();
        OTP.showStep("phone-entry");
        OTP.showError(OTP.getErrorMessage(error.code));
      });
  },

  verifyOTP: function () {
    var otpDigits = [
      document.getElementById("otp-d1").value,
      document.getElementById("otp-d2").value,
      document.getElementById("otp-d3").value,
      document.getElementById("otp-d4").value,
      document.getElementById("otp-d5").value,
      document.getElementById("otp-d6").value
    ];
    var code = otpDigits.join("");

    if (code.length !== 6) {
      OTP.showError("Please enter all 6 digits.");
      return;
    }

    OTP.showStep("verifying");

    OTP.confirmationResult.confirm(code)
      .then(function (result) {
        OTP.verified = true;
        OTP.verifiedPhone = result.user.phoneNumber;
        clearInterval(OTP.timerInterval);
        OTP.showStep("success");
        setTimeout(function () {
          OTP.hideModal();
          OTP.unlockVoting();
        }, 1500);
      })
      .catch(function (error) {
        console.error("Verify OTP error:", error);
        OTP.showStep("enter-otp");
        OTP.showError(OTP.getErrorMessage(error.code));
      });
  },

  unlockVoting: function () {
    var badge = document.getElementById("otp-verified-badge");
    if (badge) {
      badge.style.display = "inline-flex";
      badge.innerHTML = "&#10003; Phone Verified: " + OTP.verifiedPhone;
    }
  },

  showStep: function (step) {
    var steps = ["phone-entry", "sending", "enter-otp", "verifying", "success"];
    steps.forEach(function (s) {
      var el = document.getElementById("otp-step-" + s);
      if (el) el.style.display = (s === step) ? "block" : "none";
    });
    if (step === "phone-entry" || step === "enter-otp") {
      OTP.clearMessages();
    }
  },

  startTimer: function (seconds) {
    clearInterval(OTP.timerInterval);
    var timerEl = document.getElementById("otp-timer");
    var resendBtn = document.getElementById("otp-resend-btn");
    if (resendBtn) resendBtn.style.display = "none";

    OTP.timerInterval = setInterval(function () {
      seconds--;
      if (timerEl) timerEl.textContent = "Resend OTP in " + seconds + "s";
      if (seconds <= 0) {
        clearInterval(OTP.timerInterval);
        if (timerEl) timerEl.textContent = "";
        if (resendBtn) resendBtn.style.display = "inline-block";
      }
    }, 1000);
  },

  resend: function () {
    OTP.confirmationResult = null;
    if (OTP.recaptchaVerifier) {
      OTP.recaptchaVerifier.clear();
      OTP.recaptchaVerifier = null;
    }
    OTP.setupRecaptcha();
    OTP.showStep("phone-entry");
    ["otp-d1", "otp-d2", "otp-d3", "otp-d4", "otp-d5", "otp-d6"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
  },

  handleDigitInput: function (current, nextId, prevId, event) {
    var el = document.getElementById(current);
    el.value = el.value.replace(/\D/g, "").slice(-1);
    if (el.value && nextId) {
      document.getElementById(nextId).focus();
    }
    if (event.key === "Backspace" && !el.value && prevId) {
      document.getElementById(prevId).focus();
    }
  },

  handlePaste: function (event) {
    var pasted = (event.clipboardData || window.clipboardData).getData("text");
    var digits = pasted.replace(/\D/g, "").slice(0, 6).split("");
    var ids = ["otp-d1", "otp-d2", "otp-d3", "otp-d4", "otp-d5", "otp-d6"];
    digits.forEach(function (d, i) {
      if (ids[i]) document.getElementById(ids[i]).value = d;
    });
    event.preventDefault();
  },

  showError: function (msg) {
    var el = document.getElementById("otp-error");
    if (el) { el.textContent = msg; el.style.display = "block"; }
    var ok = document.getElementById("otp-success-msg");
    if (ok) ok.style.display = "none";
  },

  showSuccess: function (msg) {
    var el = document.getElementById("otp-success-msg");
    if (el) { el.textContent = msg; el.style.display = "block"; }
    var err = document.getElementById("otp-error");
    if (err) err.style.display = "none";
  },

  clearMessages: function () {
    ["otp-error", "otp-success-msg"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
  },

  getErrorMessage: function (code) {
    var map = {
      "auth/invalid-phone-number": "Invalid phone number. Use 10 digits without country code.",
      "auth/too-many-requests": "Too many attempts. Please wait and try again.",
      "auth/invalid-verification-code": "Wrong OTP. Please check and try again.",
      "auth/code-expired": "OTP has expired. Please resend.",
      "auth/quota-exceeded": "SMS quota exceeded. Try after some time.",
      "auth/missing-phone-number": "Phone number is required.",
      "auth/network-request-failed": "Network error. Check your connection."
    };
    return map[code] || "Something went wrong. Please try again.";
  }
};
