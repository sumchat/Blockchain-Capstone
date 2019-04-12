// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
let SquareVerifier = artifacts.require('SquareVerifier');
let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

let correctproof = require('../../zokrates/code/square/proof');

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    beforeEach(async function () { 
        const _SquareVerifier = await SquareVerifier.new({from:account_one});
        this.contract = await SolnSquareVerifier.new(_SquareVerifier.address,{from: account_one});
    })

     it('if a new solution can be added for contract',async function(){
        let canAdd=true;
        try{
        await this.contract.CanMintToken(account_two,2,correctproof.proof.A,correctproof.proof.A_p,
        correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,
        correctproof.proof.K,correctproof.input,{from:account_one});
        }
        catch(e)
        {
            canAdd = false;
        }
        assert.equal(canAdd,true,"Solution cannot be added");
    }) 
    
    it('if a repeated solution can be added for contract',async function(){
        let canAdd=true;
       await this.contract.CanMintToken(account_two,2,correctproof.proof.A,correctproof.proof.A_p,
            correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,
            correctproof.proof.K,correctproof.input,{from:account_one});


        try{
            await this.contract.CanMintToken(account_two,3,correctproof.proof.A,correctproof.proof.A_p,
            correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,
            correctproof.proof.K,correctproof.input,{from:account_one});
        }
        catch(e)
        {
            canAdd=false;
        }        
            assert.equal(canAdd,false,"Repeated solution can be added"); 
    })
// - use the contents from proof.json generated from zokrates steps

    
// Test verification with correct proof
it('if an ERC721 token can be minted for contract',async function(){
    let canMint = true;
   try{
     await this.contract.mintToken(account_two,2,correctproof.proof.A,correctproof.proof.A_p,correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,correctproof.proof.K,correctproof.input,{from:account_one});
   }
   catch(e) {
       canMint = false;
   }
     assert.equal(canMint,true,"cannot mint  a token");
})

// Test verification with incorrect proof
it('if an ERC721 token can be minted for contract with incorrect proof',async function(){
    let canMint = true;
    input=[3,1]
   try{
     await this.contract.mintToken(account_two,2,correctproof.proof.A,correctproof.proof.A_p,correctproof.proof.B,correctproof.proof.B_p,correctproof.proof.C,correctproof.proof.C_p,correctproof.proof.H,correctproof.proof.K,input,{from:account_one});
   }
   catch(e) {
       canMint = false;
   }
     assert.equal(canMint,false,"can mint  a token with incorrect proof");
})

});