App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      App.account = accounts[0];
      console.log("Connected account:", App.account);
    } else {
      alert("Please install MetaMask");
    }

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();
      App.listenForAccountChange();
      return App.render();
    });
  },

  listenForEvents: async function () {
    const instance = await App.contracts.Election.deployed();
    instance.votedEvent().on("data", function (event) {
      console.log("Event triggered:", event);
      App.render();
    }).on("error", console.error);
  },

  listenForAccountChange: function () {
    window.ethereum.on('accountsChanged', function (accounts) {
      App.account = accounts[0];
      App.render();
    })
  },

  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    App.contracts.Election.deployed().then(function (instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function (candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function (candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var party = candidate[2];
          var voteCount = candidate[3];
          var candidateTemplate =
            `<tr><th>${id}</th><td>${name}</td><td>${party}</td><td>${voteCount}</td></tr>`;
          candidatesResults.append(candidateTemplate);
          var candidateOption = `<option value="${id}"> ${name} (${party}) </option>`
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function (hasVoted) {
      if (hasVoted) {
        $('form').hide();
        $('#vote-msg').html(`<div class="col-sm-6 offset-sm-3 col-lg-6 offset-lg-3 col-md-6 offset-md-3">
        <div class="alert alert-danger text-center" role="alert">
          <span>Thanks For Voting !!</span>
        </div>
      </div>`)
        $('#bv-voted').text(`Yes`)
      } else {
        $('#bv-voted').text(`No`)
      }
      loader.hide();
      content.show();
    }).catch(function (error) {
      console.error(error);
    });
  },

  castVote: function () {
    // ── OTP GATE: block voting if phone not verified ──────────────────────
    // OTP.verified is set to true in otp.js only after Firebase
    // successfully confirms the user's OTP code. Without this,
    // the blockchain vote transaction will not be submitted.
    if (typeof OTP === 'undefined' || !OTP.verified) {
      alert("Please verify your mobile number via OTP before voting.");
      OTP.showModal();
      OTP.showStep("phone-entry");
      return;
    }
    // ─────────────────────────────────────────────────────────────────────

    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function (result) {
      $("#content").hide();
      $("#loader").show();
      alert("Thanks for voting");
    }).catch(function (err) {
      console.error(err);
    });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
