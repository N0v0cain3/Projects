

const app = document.getElementById('root')

const logo = document.createElement('img')
logo.src = 'logo.png'

const container = document.createElement('div')
container.setAttribute('class', 'container')

app.appendChild(logo)
app.appendChild(container)

var request = new XMLHttpRequest()
request.open('GET', 'https://projects-cc.herokuapp.com/projects/all', true)
request.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response)
  if (request.status >= 200 && request.status < 400) {
    for(var i=0;i<data.result.length;i++)  
    {
      const card = document.createElement('div')
      card.setAttribute('class', 'card')

      const h1 = document.createElement('h1')
      h1.textContent = data.result[i].repo
       
      const h2 = document.createElement('h2')
      h2.textContent = data.result[i].description

      const m =document.createElement('img')
      m.src = data.result[i].photo


      container.appendChild(card)
      card.appendChild(h1)
      card.appendChild(h2)
      card.appendChild(m)
    }}
  else {
    const errorMessage = document.createElement('marquee')
    errorMessage.textContent = `Gah, it's not working!`
    app.appendChild(errorMessage)
  }
}

request.send()