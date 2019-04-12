pragma solidity >=0.4.21 <0.6.0;
//pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/utils/Address.sol";
import "./Verifier.sol";
import "./ERC721Mintable.sol";
//  define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

contract SquareVerifier is Verifier{

}

//  define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is  RealEstateERC721Token{
    SquareVerifier public verifierContract;

    constructor(address verifierAddress)
          RealEstateERC721Token() 
          public
          {
              verifierContract = SquareVerifier(verifierAddress);

          }     


//  define a solutions struct that can hold an index & an address
struct Solutions{
    uint tokenId;
    address to;

}

// define an array of the above struct
Solutions[] SolutionsArray;

// define a mapping to store unique solutions submitted
mapping (bytes32 => Solutions) private uniqueSolutions;


//  Create an event to emit when a solution is added

event SolutionAdded(uint tokenid,address to);

//  Create a function to add the solutions to the array and emit the event

function AddSolution(address _to,uint _tokenId,bytes32 key)
                    public
{
    Solutions memory _soln = Solutions({tokenId:_tokenId,to:_to});
    SolutionsArray.push(_soln);
    uniqueSolutions[key] = _soln;
    emit SolutionAdded(_tokenId,_to);
}



function CanMintToken(address _to,uint _tokenId,
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input)
            public
            
{
     // check if solution is valid
    require(verifierContract.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input), "solution not valid");
    bytes32 key = keccak256(abi.encodePacked(a,a_p,b,b_p,c,c_p,h,k,input));
    require(uniqueSolutions[key].to == address(0),"Solution already used.");    
       
    AddSolution(_to,_tokenId,key);
      
}

//  Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
function mintToken(address _to,uint _tokenId,
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input)
            public
{
    bytes32 key = keccak256(abi.encodePacked(a,a_p,b,b_p,c,c_p,h,k,input));
    require(uniqueSolutions[key].to == address(0),"Solution already used.");
    require(verifierContract.verifyTx(a,a_p,b,b_p,c,c_p,h,k,input)," solution not valid");
    
    AddSolution(_to,_tokenId,key);
    super.mint(_to,_tokenId);
}



}




























