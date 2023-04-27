const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const strength = document.querySelector("#strength");
const generateBtn = document.querySelector(".Generate");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_+-=|\]}[{;:/?.>,<';
let password = "";
let passwordLength = 10;
let checkCount = 0;
strength.innerHTML = "Strength";
handleSlider();
//ste strength circle color to grey
setIndicator("");

//set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
    // or kuchh karna chahiye ? yes look below
    const min  = inputSlider.min;
    const max  = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)+"% 100%")
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}

//generate random integer
function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min))+min;
}

//generate random all data upper,lower,number,symbol..
function generateRandomNumber(){
    return getRndInteger(0,9); 
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSybmbols(){
    const rndlen = getRndInteger(0, symbols.length);      
    return symbols.charAt(rndlen);
}

//checking password is strong or weak..
function calcstrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
        strength.innerHTML = "Strong";
        strength.style.color = "#0f0";
        strength.style.fontWeight = "bold";
    }    
    else if( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
        strength.innerHTML ="Modrate";
        strength.style.color = "yellow";
    }else{
        setIndicator("#f00");
        strength.innerHTML = "Weak";
        strength.style.color = "Red";
        
    }
}

//copy with clipboard function
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML = "Copied"
    }catch(e){
        copyMsg.innerHTML = "Failed";
    }
    //to make copied msg visible
    copyMsg.classList.add("active");

    setTimeout(() =>{
        copyMsg.classList.remove("active");
    }, 2000);
}

//controling value after sliding 
inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

//copy btn working process
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
});

function handleCheckboxChange(){
    checkCount = 0; 
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked) checkCount++;
    });

    //special condition 
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckboxChange);
});


generateBtn.addEventListener('click', () => {
    if(checkCount == 0) return;
    if(checkCount > passwordLength){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find the new password

    //remove old password
    password = "";

    //put the stuff mentioned by checkbox
   
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSybmbols();
    // }


    let funcArr = [];

    if(uppercaseCheck.checked) 
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked) 
        funcArr.push(generateSybmbols);

    //compulsary addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    
    //remaining additon
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let rndIndex = getRndInteger(0, funcArr.length);
        password += funcArr[rndIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI 
    passwordDisplay.value = password;

    //calculate strength
    calcstrength();
});

function shufflePassword(array){
    // Fisher Yated method 
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] =  array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}