# Microservices with Nodejs

O grande desafio dos microserviços é a maneira de como os dados são gerenciados entre os diferentes serviços independentes da aplicação.

O pattern database-per-service é utilizado na arquitetura de microserviços de modo a garantir a independência e o isolamento de cada microserviço.

Comunicação síncrona entre microserviços significa que os serviços irão se comunicar diretamente entre si.

A comunicação síncrona introduz dependências entre serviços, pelo fato de eles se comunicarem diretamente entre si.
Essas dependências podem causar a queda de múltiplos serviços dependentes entre si em caso de falha em um dos serviços.
Utilizando a comunicação direta, a requisição irá demorar o tempo da requisição mais lenta.

Comunicação assíncrona entre microserviços significa que os serviços irão se comunicar entre si utilizando eventos.
