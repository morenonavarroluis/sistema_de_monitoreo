import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; // Importa el nuevo header

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Sidebar Fijo */}
      <Sidebar />

      {/* 2. Contenedor de la derecha */}
      <div className="flex-1 flex flex-col">
        
        {/* 3. Header Superior */}
        <Header />

        {/* 4. Contenido de la página */}
        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ejemplo de tarjetas de monitoreo */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">Temperatura</p>
              <h3 className="text-3xl font-bold text-gray-800">24°C</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">Humedad</p>
              <h3 className="text-3xl font-bold text-gray-800">45%</h3>
            </div>
            {/* ... más contenido */}
          </div>
        </main>
        
      </div>
    </div>
  );
}

export default Dashboard;