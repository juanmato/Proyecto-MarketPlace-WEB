import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ServicComboLogo } from '../../components/ServicComboLogo';
import { Button } from '../../components/design-system/Button';
import { Select } from '../../components/design-system/Select';
import { Input } from '../../components/design-system/Input';
import { mockUsers } from '../../data/mockData';
import { ArrowLeft } from 'lucide-react';


export function Login() {
  const [loginMethod, setLoginMethod] = useState<'hardcoded' | 'email'>('hardcoded');
  const [selectedUser, setSelectedUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'hardcoded' && selectedUser) {
      const user = mockUsers.find(u => u.email === selectedUser);
      if (user && login(user.email, user.password)) {
        navigate('/');
      }
    } else if (loginMethod === 'email' && email && password) {
      const success = login(email, password);
      if (success) {
        navigate('/');
      } else {
        // Show error toast
        alert('Credenciales incorrectas');
      }
    }
  };

  const userOptions = [
    { value: '', label: 'Selecciona un usuario...' },
    ...mockUsers.map(user => ({
      value: user.email,
      label: `${user.name} - ${
        user.role === 'solicitante' ? 'Solicitante' :
        user.role === 'proveedor_servicio' ? 'Proveedor Servicio' :
        'Proveedor Insumos'
      }`
    }))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Botón Volver */}
          <Button
            variant="ghost"
            onClick={() => navigate('/landing')}
            className="mb-4 -mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <ServicComboLogo size="medium" />
          </div>

          <h1 className="text-center mb-2">Bienvenido</h1>
          <p className="text-center text-slate-600 mb-8">
            Ingresa a tu cuenta para continuar
          </p>

          {/* Login Method Selector */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                loginMethod === 'hardcoded'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setLoginMethod('hardcoded')}
            >
              Usuario Demo
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                loginMethod === 'email'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setLoginMethod('email')}
            >
              Email/Password
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMethod === 'hardcoded' ? (
              <Select
                label="Selecciona un usuario"
                options={userOptions}
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
              />
            ) : (
              <>
                <Input
                  type="email"
                  label="Email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            )}

            <Button type="submit" fullWidth className="mt-6">
              Ingresar
            </Button>
          </form>

          {/* Demo Users Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Usuarios de demostración:</p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• juan@solicitante.com - Solicitante</li>
              <li>• maria@proveedor.com - Proveedor Servicio</li>
              <li>• carlos@insumos.com - Proveedor Insumos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}