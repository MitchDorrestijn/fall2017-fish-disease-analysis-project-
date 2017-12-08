# **Code**

Het doel van dit hoofdstuk is om de implementatie details te beschrijven voor de delen van de code die belangrijk, complex of significant zijn. 

### **Structure**

In de [Create react app documentatie](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) kan gevonden worden wat de structuur is van de applicatie. Er wordt gebruik gemaakt van JSX-code om HTML te genereren.

### **Error handling**

##### **Client**

Errors worden server-side teruggegeven vanuiteen http-request. Wanneer de status van een http-request niet in de 200->300 range ligt wordt een melding van de http-request weergegeven indienmogelijk.

**Server**

Server side worden catches afgehandeld als eenserver operatie faalt. Wanneer dit gebeurd wordt een Error code gestuurd alsresponse. In de api-docs kunnen de responses gevonden worden.

### **Security**

API's zijn alleen toegankelijk voor gebruikersdie geauthentiseerd zijn. Door middel van een unique authorisation token. Ditworden opgevangen in de middleware van de server.

 