//custom js file for home.ejs

//selecting the required elements for accessing their values
const addoption= document.querySelector('#add-option'); 
const options= document.querySelector('#options'); 
const option_text= document.querySelector('#option-text'); 

//this stores the count of number of options
var count=0;

//when add option button is clicked then we are appending that option in the options container on screen for user to view
addoption.addEventListener('click', function(e) {
    if((option_text.value).length==0)
    {
        console.log('empty');
        return;
    }
    console.log('fdsf');
    e.preventDefault();
    count++;

    const newoption= document.createElement('li');
    newoption.innerHTML= `
        <input name="option_${count}" type="text" value="${option_text.value}" readonly>
    `;

    options.appendChild(newoption);

    options_array.push(option_text.value);
})