<% const productos=Object.keys(datos)%>
<% for (let producto of productos) { %>
document.querySelector("tbody").innerHTML += "<tr><th><%= producto %></th><th><%= datos[producto].ppu %>$</th><th><%= datos[producto].gain %></th><th><%= datos[producto].profit %>%</th><th><%= datos[producto].ruta %></th>";
<% } %>
