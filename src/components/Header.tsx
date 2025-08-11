import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="max-w-5xl mx-auto mb-6 p-4 bg-gray-800 rounded-b-lg shadow-lg">
      <ul className="flex justify-center md:justify-start gap-4 text-white font-bold">
        <li>
          <Link to="/" className="hover:text-blue-400 transition-colors duration-200">
            Início
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors duration-200">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/reports" className="hover:text-blue-400 transition-colors duration-200">
            Relatórios
          </Link>
        </li>
      </ul>
    </nav>
  );
}