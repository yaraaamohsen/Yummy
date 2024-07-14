const menuListWidth = $('.menu').outerWidth();

function loading() {
    $(window).on('load', function () {
        $('.loadingScreen').fadeOut(1000);
        $('body').css('overflow', 'visible');
    })
}

function openBtn() {
    $('nav').animate({ left: '0' }, 1000, function(){
        $('ul li').eq(0).animate({top :'0'},50, function(){
            $('ul li').eq(1).animate({top :'0'},100,function(){
                $('ul li').eq(2).animate({top :'0'},100,function(){
                    $('ul li').eq(3).animate({top :'0'},100,function(){
                        $('ul li').eq(4).animate({top :'0'},100)
                    })
                })
            })
        })
    });
    document.querySelector('.closeBtn').classList.remove('d-none');
    document.querySelector('.barsBtn').classList.add('d-none');
}

function closeBtn() {
    $('nav').animate({ left: -menuListWidth }, 1500);
    document.querySelector('.closeBtn').classList.add('d-none');
    document.querySelector('.barsBtn').classList.remove('d-none');
}

$(document).on('click', function () {
    if ($('nav').css('left') == '0px') { closeBtn(); }
})

function hideSearch(){
    document.querySelector('.search').classList.add('d-none');
}

$('.barsBtn').on('click', function () { openBtn() })
$('.closeBtn').on('click', function () { closeBtn() })

function display(arr) {
    if(arr!= null){
        let cartona = '';
        for (let i = 0; i < arr.length; i++) {
            cartona += `
            <div class="col-md-3">
                <div data-id="${arr[i].idMeal}" class="item overflow-hidden position-relative rounded-3">
                    <img src="${arr[i].strMealThumb}" class="rounded-3 img-fluid " alt="w-100">
                    <div
                        class="layer rounded-3 bg-opacity-50 bg-white position-absolute top-0 start-0 bottom-0 end-0 d-flex align-items-center">
                        <p class="mx-2 fs-1 fw-bold ">${arr[i].strMeal}</p>
                    </div>
                </div>
            </div>
            `
        }
        $('.rowData').removeClass('d-none');
        document.querySelector('.rowData').innerHTML = cartona;
        console.log('hello');
        console.log(arr);
        getId()
    }
}

async function displayRandom() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    let responseResult = await response.json();
    let result = responseResult.meals;
    console.log(result);
    display(result)
    getId();
    loading();
}
displayRandom()

async function detailsFetch(mealId) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    let result = await response.json();
    let detailsArray = result.meals[0];
    let cartona = '';
    cartona += `
            <div class="col-md-4 text-white">
                <img src="${detailsArray.strMealThumb}" class="w-100 rounded-3" alt="">
                <h4 class="py-3">${detailsArray.strMeal}</h4>
            </div>
            <div class="col-md-8 text-white">
                <h2>instructions</h2>
                <p>${detailsArray.strInstructions}</p>
                <h3>area: <span>${detailsArray.strArea}</span></h3>
                <h3>Category: <span>${detailsArray.strCategory}</span></h3>
                <h3>Recipes:</h3>
                <ul class="list-unstyled list-inline">
                `
                for (let i = 1; i <= 20; i++) {
                    let ingredient = detailsArray[`strIngredient${i}`];
                    let measure = detailsArray[`strMeasure${i}`];
                    if (ingredient && measure !== '') {
                        cartona += `<li class="btn btn-primary m-2 px-2">${measure} ${ingredient}</li>`;
                    }}
                cartona+=`
                    </ul>
                    <a href="${detailsArray.strSource}" class="btn btn-success">Source</a>
                    <a href="${detailsArray.strYoutube}" class="btn btn-danger">Youtube</a>
                    </div>
                `
    document.querySelector('.rowData').innerHTML = cartona;
    console.log(detailsArray);
    hideSearch();
    return detailsArray;
}

function getId() {
    $('.rowData .item').on('click', function () {
        let itemId = $(this).attr('data-id');
        console.log(itemId);
        detailsFetch(itemId);
    })
}

async function displayCategories() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let result = await response.json();
    let catArray = result.categories;
    console.log(catArray);
    let cartona = '';
    for (let i = 0; i < catArray.length; i++) {
        cartona += `
        <div class="col-md-3 text-center">
            <div data-id="${catArray[i].idCategory}" class="item overflow-hidden position-relative rounded-3">
                <img src="${catArray[i].strCategoryThumb}" class="rounded-3 img-fluid" alt="w-100">
                <div
                    class="layer rounded-3 bg-opacity-50 bg-white position-absolute top-0 start-0 bottom-0 end-0 py-2 text-center">
                    <h3 class="getCategoryName text-center fs-1 fw-bold">${catArray[i].strCategory}</h3>
                    <p class="px-2">${catArray[i].strCategoryDescription.slice(0, 80)}</p>
                </div>
            </div>
        </div>
    `
    }
    document.querySelector('.rowData').innerHTML = cartona;
    getCategoryName();
}

$('#categories').on('click', function () {
    displayCategories();
    closeBtn();
    hideSearch();
})

async function getCategoryItems(categoryName) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
    console.log(response);
    let result = await response.json();
    let categoryNameArr = result.meals;
    console.log(categoryNameArr);
    await display(categoryNameArr);
}

function getCategoryName() {
    $('.item').on('click', function () {
        let mealname = $(this).find('.getCategoryName').text();
        console.log(mealname);
        getCategoryItems(mealname);
    })
}

async function displayArea() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let result = await response.json();
    let areaArray = result.meals;
    console.log(areaArray);
    let cartona = '';
    for (let i = 0; i < areaArray.length; i++) {
        cartona += `
            <div class="col-md-3 text-center areaItem">
                <div class="text-white">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3 class="areaName py-2">${areaArray[i].strArea}</h3>
                </div>
            </div>
    `
    }
    document.querySelector('.rowData').innerHTML = cartona;
    getAreaName()
}

$('#area').on('click', function () {
    closeBtn();
    displayArea();
    hideSearch();
})

function getAreaName() {
    $('.areaItem').on('click', function () {
        let areaName = $(this).find('.areaName').text();
        console.log(areaName);
        getAreaItems(areaName)
    })
}

async function getAreaItems(area) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let result = await response.json();
    let areaArr = result.meals;
    console.log(areaArr);
    display(areaArr)
}

$('#ingredients').on('click', function () {
    closeBtn();
    displayIngredients();
    hideSearch();
})

async function displayIngredients() {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let result = await response.json();
    let ingArray = result.meals;
    console.log(ingArray);
    let cartona = '';
    for (let i = 0; i < ingArray.length; i++) {
        if (ingArray[i].strDescription !== null) {
            cartona += `
            <div class="col-md-3 ingredientItem">
                <div class="text-white text-center">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3 class="ingredientName py-2">${ingArray[i].strIngredient}</h3>
                    <p>${ingArray[i].strDescription.slice(0, 80)}</p>
                </div>
            </div>
            `
        }
    }
    document.querySelector('.rowData').innerHTML = cartona;
    getIngredientName()
}

async function getIngredientItems(ingredient) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    let result = await response.json();
    let ingredientArr = result.meals;
    console.log(ingredientArr);
    display(ingredientArr)
}

function getIngredientName() {
    $('.ingredientItem').on('click', function () {
        console.log('hello');
        let ingredientName = $(this).find('.ingredientName').text();
        console.log(ingredientName);
        getIngredientItems(ingredientName)
    })
}

function validation(ele) {
    var regex = {
        userName: /^[a-z||A-Z]\w{2,}/,
        userEmail: /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        userPhone: /^01[0125][0-9]{8}$/,
        userAge: /^(1[1-9]|[2-9]\d)$/,
        userPassword: /^[a-z||A-Z]\w{8,}/,
        userRepassword: /^[a-z||A-Z]\w{8,}/
    }
    if (regex[ele.name].test(ele.value)) {
        ele.nextElementSibling.classList.add('d-none');
    }
    else {
        ele.nextElementSibling.classList.remove('d-none');
    };
}

$('form input').on('input', function () {
    validation(this);
    checkIfFormFilledOrNot();
    hideSearch();
})

function validate(){
    if ($('.nameAlert').hasClass('d-none') && 
    $('.emailAlert').hasClass('d-none') && 
    $('.numberAlert').hasClass('d-none') && 
    $('.ageAlert').hasClass('d-none') && 
    $('.passwordAlert').hasClass('d-none') &&
    $('.repasswordAlert').hasClass('d-none')) {
        $('button').attr('disabled', false)
    }
    else {
        $('button').attr('disabled', true)
    }
}

function checkIfFormFilledOrNot(){
    if($('.name').val() == '' ||
    $('.email').val() == '' ||
    $('.number').val() == '' ||
    $('.age').val() == '' ||
    $('.password').val() == '' ||
    $('.repassword').val() == ''){
        console.log('not helloi');
    }
    else
    {
        validate()
    }
}

function displayContact(){
    let cartona = `
    <form class="row mx-auto justify-content-center vh-100 align-items-center align-content-center w-75 gx-3 gy-3">
                <div class="col-md-6">
                    <input type="text" class="form-control name" name="userName" placeholder="Enter Your Name">
                    <div class="alert alert-danger nameAlert my-1 p-3 text-center d-none">
                        <p class="mb-0">Special characters and numbers not allowed</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <input type="email" class="form-control email" name="userEmail" placeholder="Enter Your Email">
                    <div class="alert alert-danger emailAlert my-1 p-3 text-center d-none">
                        <p class="mb-0">Email not valid *exemple@yyy.zzz</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control number" name="userPhone" placeholder="Enter valid Phone Number">
                    <div class="alert alert-danger numberAlert my-1 p-3 text-center d-none">
                        <p class="mb-0">Enter valid Phone Number</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control age" name="userAge" placeholder="Enter Your Age">
                    <div class="alert alert-danger ageAlert my-1 p-3 text-center d-none">
                        <p class="mb-0">Enter valid age</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <input type="password" class="form-control password" name="userPassword" placeholder="Password">
                    <div class="alert alert-danger passwordAlert my-1 p-3 text-center d-none">
                        <p class="mb-0">Enter valid password *Minimum eight characters, at least one letter and one number</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <input type="password" class="form-control repassword" name="userRepassword" placeholder="Re-enter Password">
                    <div class="alert alert-danger repasswordAlert my-1 p-3 text-center d-none">
                        <p class="mb-0">Enter valid repassword</p>
                    </div>
                </div>
                <button type="submit" class="col-md-1 btn btn-outline-danger" disabled>Submit</button>
            </form>
    `
    document.querySelector('.rowData').innerHTML = cartona;
}

$('#contact').on('click', function(){
    displayContact()
})

async function search(userInput){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`);
    let resultJson = await response.json();
    let result = resultJson.meals;
    console.log(result);
    display(result)
}

function displaySearch(){
    document.querySelector('.search').classList.remove('d-none');
    $('.search input').on('input', function(){
        let userInput = $(this).val();
        console.log($(this).val());
        search(userInput);
    })
}

$('#search').on('click', function(){
    displaySearch();
})
