# Microservices with Nodejs

O grande desafio dos microserviços é a maneira de como os dados são gerenciados entre os diferentes serviços independentes da aplicação.

O pattern database-per-service é utilizado na arquitetura de microserviços de modo a garantir a independência e o isolamento de cada microserviço.

Comunicação síncrona entre microserviços significa que os serviços irão se comunicar diretamente entre si.

A comunicação síncrona introduz dependências entre serviços, pelo fato de eles se comunicarem diretamente entre si.
Essas dependências podem causar a queda de múltiplos serviços dependentes entre si em caso de falha em um dos serviços.
Utilizando a comunicação direta, a requisição irá demorar o tempo da requisição mais lenta.

Comunicação assíncrona entre microserviços significa que os serviços irão se comunicar entre si utilizando eventos.

Pods são as menores unidade de deploy do kubernetes, no qual são compostas por um conjunto de containers.

O termo serviço em kubernetes se refere a uma interface de acesso a um conjunto de pods.

O deployment é um monitor de pods, que periodicamente executa health checks e caso um pod quebre, o deployment é responsável por reiniciar o pod quebrado.

O termo nó, em kubernetes, se refere a uma máquina virtual no qual um conjunto de pods irá ser executado.

O cluster é um conjunto de nós mais o master.

Os Services são objetos úteis para fornecer uma rede de comunicação entre pods.

Existem diversos tipos de serviços como:

- Cluster Ip - fornece uma url que expõe os pods dentro um cluster.
- Node port - Torna um pod acessível fora do cluster, sendo utilizado para propósitos de desenvolvimento.
- Load balancer - Também torna um pod acessível fora do cluster, sendo o jeito certo de se expor um pod.
- External name - Redireciona requests feitas dentro do cluster para um CNAME.

O Ingress Controller é um tipo de Pod responsável por definir as regras de distribuição de tráfico para os outros serviços.

Podemos comunicar entre diferentes namespaces utilizando um external name service.
