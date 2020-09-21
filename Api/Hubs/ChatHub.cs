using System.Threading.Tasks;
using Api.Models;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(Message message)
        {
            // ....
            
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}