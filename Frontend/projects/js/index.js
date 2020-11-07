

const app = document.getElementById('root')
// app.innerHTML = "<b>dwwikdhaidiiwa</b>";
// app.innerHTML += "<h2>Card Header and Footer</h2>"+
//         '<div class="card">'+
//           '<div class="card-header">Header</div>'+
//        '   <div class="card-body">Content</div> '+
//          ' <div class="card-footer">Footer</div>'+
//      '  </div><h2>Card Header and Footer</h2>'
// const container = document.createElement('div')
// container.setAttribute('class', 'container')

// app.appendChild(logo)
// app.appendChild(container)

// var request = new XMLHttpRequest()
// request.open('GET', 'https://projects-cc.herokuapp.com/projects/all', true)
// request.onload = function () {
//   // Begin accessing JSON data here
//   var data = JSON.parse(this.response)
//   if (request.status >= 200 && request.status < 400) {
//     for(var i=0;i<2;i++)  
//     {
//     //   const card = document.createElement('div')
//     //   card.setAttribute('class', 'card')

//     //   const h1 = document.createElement('h1')
//     //   h1.textContent = data.result[i].repo
       
//     //   const h2 = document.createElement('h2')
//     //   h2.textContent = data.result[i].description

//     //   const m =document.createElement('img')
//     //   m.src = data.result[i].photo


//     //   container.appendChild(card)
//     //   card.appendChild(h1)
//     //   card.appendChild(h2)
//     //   card.appendChild(m)

//     // app.inn
//     app.innerHTML += "<h2>Card Header and Footer</h2>"+
//         '<div class="card">'+
//           '<div class="card-header">+data.result[0].ideaBy+</div>'+
//        '   <div class="card-body">Content</div> '+
//          ' <div class="card-footer">Footer</div>'+
//      '  </div><h2>Card Header and Footer</h2>'

//        console.log('daidoawnfa')
    

//     }


//   }
//   else {
//     const errorMessage = document.createElement('marquee')
//     errorMessage.textContent = `Gah, it's not working!`
//     app.appendChild(errorMessage)
//   }
// }

// request.send()
$.get('https://projects-cc.herokuapp.com/projects/all', function(data,status){
  console.log(data)

  document.getElementById("a12").innerHTML = ""
  for(var i = 0; i<data.result.length; i++) {
    document.getElementById("a12").innerHTML += '<div  class="carousel-item col-12 col-sm-6 col-md-4 col-lg-3 active">'+ '<div>'+ document.createElement("img") + data.result[i].photo +'</div>'
                           + data.result[i].repo+
                        '</div>'    
             console.log("For loop works")
  }
})

$.get('https://projects-cc.herokuapp.com/projects/domain/web', function(data,status){
  console.log(data)

  document.getElementById("a13").innerHTML = ""
  for(var i = 0; i<data.result.length; i++) {
    document.getElementById("a13").innerHTML += '<div  class="carousel-item col-12 col-sm-6 col-md-4 col-lg-3 active">'+ '<div>'+ document.createElement("img") + img.setAttribute("src", data.result[i].photo) +'</div>'
                           + data.result[i].repo+
                        '</div>'    
             console.log("For loop works")
  }
})


document.getElementById('closed').style.display = "none"

