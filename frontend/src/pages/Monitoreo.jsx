import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import Table from '../components/Table';    

function Monitoreo() {
  return (
   
     <div className="flex min-h-screen bg-gray-50">
      
      <Sidebar />

     
      <div className="flex-1 flex flex-col">
        
        
        <Header />

        
        <main className="p-8">
          <div>
            <h1 className="text-2xl font-bold mb-4">Monitoreo de Dispositivos</h1>
          </div>
          <div className="grid ">
            <Table/>
          </div>
        </main>
        
      </div>
    </div>
  );
}

export default Monitoreo;