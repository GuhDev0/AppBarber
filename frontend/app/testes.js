const dateObj = new Date()

const dateFormatada = dateObj.toLocaleDateString("pt-BR",{month:"long"}) 

console.log(dateFormatada)