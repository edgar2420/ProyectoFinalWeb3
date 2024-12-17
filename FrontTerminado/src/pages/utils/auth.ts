export const getAccessToken = (): string | null => {
    const cookie = document.cookie.split("; ").find((row) => row.startsWith("access_token="));
    return cookie ? cookie.split("=")[1] : null;
  };
  
  export const getUserRoles = (): string[] => {
    const roles = localStorage.getItem("user_roles");
    return roles ? JSON.parse(roles) : [];
  };
  