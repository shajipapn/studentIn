var web3;
var address="0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d";

async function connect (){
    await window.web3.cuurentprovider.enable();
    web3=new Web3(window.web3.cuurentprovider);
}

if (typeof web3 !== 'undefined'){
    web3=new Web3(window.web3.cuurentprovider);
}
else{
    web3=new Web3(new web3.provider.HttpProvider("https://portal.hedera.com/?network=testnet"));
}

var abi=[
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "amt",
				"type": "int256"
			}
		],
		"name": "deposit_money",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "amt",
				"type": "int256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getbalance",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

var contract=new web3.eth.contract(abi,address);

function deposit(){
    var inputval=document.getElementById("amount").value;
    web3.eth.getaccount().then(function(account){
        return contract.methods.deposit_money(inputval).send({from: account[0]});
    }).then(function(temp){
        $("amount").val ("");
        show_balance();

    }).catch(function(tmp){
        alert(tmp);
    })
}

function withdraw(){
    var inputval=document.getElementById("amount").value;
    web3.eth.getaccount().then(function(account){
        return contract.methods.withdraw_money(inputval).send({from: account[0]});
    }).then(function(temp){
        $("amount").val ("");
        show_balance();

    }).catch(function(tmp){
        alert(tmp);
    })
}

function show_bal(){ 
      contract.methods.getBalance().call().then(function(balance){
      $("#balance").html(balance);
    })
}