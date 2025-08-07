export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  return <p onClick={handleLogout} style={{ float: 'right' }}>Logout</p>;
}