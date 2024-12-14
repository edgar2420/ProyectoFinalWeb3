namespace Billeteras.Services
{
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Newtonsoft.Json;

    public class AuthService
    {
        private readonly HttpClient _httpClient;

        public AuthService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> LoginAsync(string username, string password)
        {
            var payload = new
            {
                username,
                password
            };

            var jsonPayload = JsonConvert.SerializeObject(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("http://localhost:8000/api/login/", content);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                return responseContent; // Devuelve el JWT
            }

            return null; // Login fallido
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            var payload = new
            {
                token
            };

            var jsonPayload = JsonConvert.SerializeObject(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("http://localhost:8000/api/validate-token/", content);

            return response.IsSuccessStatusCode;
        }
    }

}
