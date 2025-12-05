// Utility to decode JWT token and extract userId
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // JWT token has 3 parts separated by dots: header.payload.signature
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return payload.sub; // 'sub' is the subject (userId) in our JWT
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

