import React, { useState } from 'react';
import { 
  Folders, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  X
} from 'lucide-react';

interface Project {
  id: number;
  nume: string;
  status: 'În desfășurare' | 'Finalizat' | 'În așteptare';
  deadline: string;
  echipa: {
    membri: string[];
    numeEchipa: string;
  };
  progres: number;
}

function App() {
  const [proiecte, setProiecte] = useState<Project[]>([
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    nume: '',
    status: 'În așteptare',
    deadline: new Date().toISOString().split('T')[0],
    echipa: {
      membri: [],
      numeEchipa: ''
    },
    progres: 0
  });
  const [membruNou, setMembruNou] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProiecte(prev => [...prev, {
      id: Date.now(),
      ...newProject
    }]);
    setIsModalOpen(false);
    setNewProject({
      nume: '',
      status: 'În așteptare',
      deadline: new Date().toISOString().split('T')[0],
      echipa: {
        membri: [],
        numeEchipa: ''
      },
      progres: 0
    });
  };

  const addTeamMember = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && membruNou.trim()) {
      e.preventDefault();
      setNewProject(prev => ({
        ...prev,
        echipa: {
          ...prev.echipa,
          membri: [...prev.echipa.membri, membruNou.trim()]
        }
      }));
      setMembruNou('');
    }
  };

  const removeTeamMember = (index: number) => {
    setNewProject(prev => ({
      ...prev,
      echipa: {
        ...prev.echipa,
        membri: prev.echipa.membri.filter((_, i) => i !== index)
      }
    }));
  };

  const [proiecteInitiale] = useState<Project[]>([
    {
      id: 1,
      nume: "Redesign Website",
      status: "În desfășurare",
      deadline: "2024-04-15",
      echipa: {
        membri: ["Maria P.", "Alex D.", "Ioan M."],
        numeEchipa: "Echipa Design"
      },
      progres: 65
    },
    {
      id: 2,
      nume: "Aplicație Mobilă",
      status: "În așteptare",
      deadline: "2024-05-01",
      echipa: {
        membri: ["Elena R.", "Andrei S."],
        numeEchipa: "Echipa Mobile"
      },
      progres: 30
    },
    {
      id: 3,
      nume: "Integrare API",
      status: "Finalizat",
      deadline: "2024-03-20",
      echipa: {
        membri: ["Dan M.", "Ana P."],
        numeEchipa: "Echipa Backend"
      },
      progres: 100
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Folders className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-semibold text-white">
                Manager Proiecte
              </h1>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Proiect Nou
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-400">Finalizate</h2>
                  <p className="text-2xl font-semibold text-white">
                    {proiecte.filter(p => p.status === 'Finalizat').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-400">În Desfășurare</h2>
                  <p className="text-2xl font-semibold text-white">
                    {proiecte.filter(p => p.status === 'În desfășurare').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-400">Membri Echipă</h2>
                  <p className="text-2xl font-semibold text-white">
                    {Array.from(new Set(proiecte.flatMap(p => p.echipa.membri))).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Proiect
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Echipă
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Progres
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acțiuni</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {proiecte.map((proiect) => (
                  <tr key={proiect.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{proiect.nume}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        proiect.status === 'Finalizat' ? 'bg-green-100 text-green-800' :
                        proiect.status === 'În desfășurare' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {proiect.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-300">
                          {new Date(proiect.deadline).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col space-y-2">
                        <span className="text-indigo-400 text-xs font-medium">
                          {proiect.echipa.numeEchipa}
                        </span>
                        <div className="flex items-center">
                        {proiect.echipa.membri.slice(0, 2).map((membru, idx) => (
                          <div key={idx} className="flex-shrink-0">
                            <div className={`h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center -ml-1 first:ml-0 border-2 border-white`}>
                              <span className="text-xs font-medium text-indigo-700">
                                {membru.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                        ))}
                        {proiect.echipa.membri.length > 2 && (
                          <div className="flex-shrink-0 -ml-1">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
                              <span className="text-xs font-medium text-gray-500">
                                +{proiect.echipa.membri.length - 2}
                              </span>
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            proiect.progres === 100 ? 'bg-green-600' :
                            proiect.progres >= 50 ? 'bg-blue-600' :
                            'bg-yellow-600'
                          }`}
                          style={{ width: `${proiect.progres}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{proiect.progres}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal pentru proiect nou */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-lg w-full p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Proiect Nou</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nume" className="block text-sm font-medium text-gray-300">
                    Nume Proiect
                  </label>
                  <input
                    type="text"
                    id="nume"
                    required
                    value={newProject.nume}
                    onChange={e => setNewProject(prev => ({ ...prev, nume: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                    Status
                  </label>
                  <select
                    id="status"
                    value={newProject.status}
                    onChange={e => setNewProject(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="În așteptare">În așteptare</option>
                    <option value="În desfășurare">În desfășurare</option>
                    <option value="Finalizat">Finalizat</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-300">
                    Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    required
                    value={newProject.deadline}
                    onChange={e => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="progres" className="block text-sm font-medium text-gray-300">
                    Progres ({newProject.progres}%)
                  </label>
                  <input
                    type="range"
                    id="progres"
                    min="0"
                    max="100"
                    value={newProject.progres}
                    onChange={e => setNewProject(prev => ({ ...prev, progres: parseInt(e.target.value) }))}
                    className="mt-1 block w-full"
                  />
                </div>

                <div>
                  <label htmlFor="numeEchipa" className="block text-sm font-medium text-gray-300">
                    Nume Echipă
                  </label>
                  <input
                    type="text"
                    id="numeEchipa"
                    value={newProject.echipa.numeEchipa}
                    onChange={e => setNewProject(prev => ({
                      ...prev,
                      echipa: { ...prev.echipa, numeEchipa: e.target.value }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Echipă
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="Apasă Enter pentru a adăuga un membru"
                      value={membruNou}
                      onChange={e => setMembruNou(e.target.value)}
                      onKeyDown={addTeamMember}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newProject.echipa.membri.map((membru, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {membru}
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="ml-1 text-indigo-600 hover:text-indigo-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Creează Proiect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;