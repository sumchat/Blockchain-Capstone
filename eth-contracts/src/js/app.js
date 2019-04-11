
App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
   

    init: async function () {
        //App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

   /*  readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    }, */

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initMintProperty();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initMintProperty: function () {
        /// Source the truffle compiled smart contracts
        var jsonVerifier='../../eth-contracts/build/contracts/SolnSquareVerifier.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonVerifier, function(data) {
            console.log('data',data);
            var verifierArtifact = data;
            App.contracts.SolnSquareVerifier = TruffleContract(verifierArtifact);
            App.contracts.SolnSquareVerifier.setProvider(App.web3Provider);
            
            //App.fetchItemBufferOne();
            //App.fetchItemBufferTwo();
            //App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();
        App.propertyID = $("#propertyid").val();
        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);
        if(processId == 2)
        {
            return await App.mintProperty(event); 
        }

      
    },
   // account_two,2,correctproof.proof.A,correctproof.proof.A_p,correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,correctproof.proof.K,correctproof.input,{from:account_one}
    mintProperty:function(event){
        event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));
        //var propertyId = document.getElementById('propertyid').value;
        App.contracts.SolnSquareVerifier.deployed().then(function(instance) {
            return instance.mintToken(                 
                App.metamaskAccountID,
                App.propertyID,
                ValidProof.proof.A,
                ValidProof.proof.A_p,
                ValidProof.proof.B,
                ValidProof.proof.B_p,
                ValidProof.proof.C,
                ValidProof.proof.C_p,
                ValidProof.proof.H,
                ValidProof.proof.K,
                ValidProof.input
            );
        }).then(function(result) {
            $("#ftc-events").text(result.tx);
            //console.log('disinfectItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });

    }

  
};
let ValidProof = {
	"proof":
	{
		"A":["0x43c6ec7be9e5770e03ec111f61f0953ba2d05e60619f4787c38e79b74945078", "0x18262cd743d18503b08eccd83973a99a9440dbab8edec4837a63035d6b1f2895"],
		"A_p":["0x2af5448dc9f8a816c7cea5ee04b445bdb31634b321d821943f45c7d690ab043", "0x11d30e8c23c746412351765fde020f8e8e56349a589b888aba5e30bfd6c49174"],
		"B":
			[["0x9f450c3337af90d62a149867c02355325d4fb47460d70152f835d5acac8341a", "0x2f98c6b6cfe2e9acec223ff308d480cae1b5587e76f0ed1f0effc509c4df335"], ["0x3045cd77230b8a933d73684834b22013ec610f07dd8c5fecef14d0c7f5f39fb1", "0x21cebf84df4af82809ac147c97b1bbd7c0fbd50a4416e64ac2169e0c84b89d91"]],
		
		"B_p":["0x271ea239002d196b0392cb04b48b337f98c871a9b4bf64d7391bc57c3214df17", "0x2d0d4b5da6423de499e25f2c52f930ab8be81d2beebb05b104d8035524c04d22"],
		"C":["0x1f33d7cfac326c51c9384dccc31e0aae3325b65a7c193b8b5119ac2d5d0abcfc", "0x2865ce013f95fdd60e48d35ba0759ebcaa9e1377aa3e00b2d2e54bebf2a9f198"],
		"C_p":["0x7f3cb0e1163aeaea25ca3a164ed7e5ba7d59f5398e6186467f47336b2b4594f", "0x6e5f2db5bd7cbc33f49c520adb5c49153d7f3e6bacbbe01b40197d932cdc9f2"],
		"H":["0x2c1621e3eeb8b501461810dee7ef04079309af6a21f1623894029742fcdd57c6", "0x254232a535d6d71e13b47717db6c9bd98cf0aaa2fab67843b3600be3145c2f2d"],
		"K":["0x210f1c8e5b9c674f0f582a38f98fc0605f84f8adb7b65fe7a84cd14031507757", "0x1f9e763bf81e490d9749bf5adb79b31c35455d2ddb99da1647eb9d650d6885cb"]
	},
	"input":[9,1]} 

$(function () {
    $(window).load(function () {
        App.init();
    });
});
