var ERC721MintableComplete = artifacts.require('RealEstateERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const account_five = accounts[4];
    const account_six = accounts[5];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two,1,{from: account_one});
            await this.contract.mint(account_three,2,{from: account_one});
            await this.contract.mint(account_four,3,{from: account_one});
            await this.contract.mint(account_five,4,{from: account_one});
            //await this.contract.mintUniqueTokenTo(account_two, 0, proof_3.proof.A, proof_3.proof.A_p, proof_3.proof.B, proof_3.proof.B_p, proof_3.proof.C, proof_3.proof.C_p, proof_3.proof.H, proof_3.proof.K, proof_3.input, {from: account_one});
           // await this.contract.mintUniqueTokenTo(account_three, 1, proof_4.proof.A, proof_4.proof.A_p, proof_4.proof.B, proof_4.proof.B_p, proof_4.proof.C, proof_4.proof.C_p, proof_4.proof.H, proof_4.proof.K, proof_4.input, {from: account_one});
           // await this.contract.mintUniqueTokenTo(account_four, 2, proof_5.proof.A, proof_5.proof.A_p, proof_5.proof.B, proof_5.proof.B_p, proof_5.proof.C, proof_5.proof.C_p, proof_5.proof.H, proof_5.proof.K, proof_5.input,{from: account_one});
            //await this.contract.mintUniqueTokenTo(account_five, 3, proof_6.proof.A, proof_6.proof.A_p, proof_6.proof.B, proof_6.proof.B_p, proof_6.proof.C, proof_6.proof.C_p, proof_6.proof.H, proof_6.proof.K, proof_6.input,{from: account_one});
            //await this.contract.mintUniqueTokenTo(account_six, 4, proof_7.proof.A, proof_7.proof.A_p, proof_7.proof.B, proof_7.proof.B_p, proof_7.proof.C, proof_7.proof.C_p, proof_7.proof.H, proof_7.proof.K, proof_7.input,{from: account_one});
      
        })

        it('should return total supply', async function () { 
            let total = await this.contract.totalSupply.call();
            assert.equal(total.toNumber(), 4, "result not correct");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf.call(account_two, {from: account_one});
            assert.equal(balance.toNumber(), 1, "Balance of account_two should be 1");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
           let _tokenURI = await this.contract.tokenURI.call(1, {from: account_one});
           assert(_tokenURI == "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "TokenURI does not match");
        })

        it('should transfer token from one owner to another', async function () {        
        let tokenId=1;
        await this.contract.approve(account_three, tokenId, {from: account_two});
         await this.contract.transferFrom(account_two, account_three, tokenId, {from: account_two});
        // check new owner
        currentOwner = await this.contract.ownerOf.call(tokenId);
        assert.equal(currentOwner, account_three, "Owner should be account_three");
        
       
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let failed = false;
            try {
                await this.contract.mint(account_six,5,{from: account_two});
              } catch (e) {
                failed = true;
              }
    
              assert.equal(failed, true, "should fail when address is not account owner");
              
         
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.owner.call({from: account_one});
            assert.equal(owner, account_one, "owner should be account_one");
        })

    });
})