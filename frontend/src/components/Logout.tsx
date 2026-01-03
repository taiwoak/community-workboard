export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  return <p onClick={handleLogout} style={{ float: 'right' }} className=" hover:text-blue-600 transition cursor-pointer">Logout</p>;
}