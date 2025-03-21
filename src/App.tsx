import React, { useState, useMemo } from 'react';
import Select, { ActionMeta, MultiValue, SingleValue, Theme } from 'react-select';
import { 
  Folders, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  X,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

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
  prioritate: 'Înaltă' | 'Medie' | 'Scăzută';
  categorie: string;
}

function App() {
  const [proiecte, setProiecte] = useState<Project[]>([
    {
      id: 1,
      nume: "Redesign Website",
      status: "În desfășurare",
      deadline: "2024-04-15",
      echipa: {
        membri: ["Maria P.", "Alex D.", "Ioan M."],
        numeEchipa: "Echipa Design"
      },
      progres: 65,
      prioritate: "Înaltă",
      categorie: "Design"
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
      progres: 30,
      prioritate: "Medie",
      categorie: "Dezvoltare"
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
      progres: 100,
      prioritate: "Scăzută",
      categorie: "Backend"
    }
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
    progres: 0,
    prioritate: 'Înaltă',
    categorie: 'Design'
  });
  const [membruNou, setMembruNou] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Project['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Project['prioritate'] | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof Project>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Add new state for team members options
  const [teamMembersOptions] = useState<Option[]>([
    { value: 'Maria P.', label: 'Maria P.' },
    { value: 'Alex D.', label: 'Alex D.' },
    { value: 'Ioan M.', label: 'Ioan M.' },
    { value: 'Elena R.', label: 'Elena R.' },
    { value: 'Andrei S.', label: 'Andrei S.' },
    { value: 'Dan M.', label: 'Dan M.' },
    { value: 'Ana P.', label: 'Ana P.' },
  ]);

  const [teamNamesOptions] = useState<Option[]>([
    { value: 'Echipa Design', label: 'Echipa Design' },
    { value: 'Echipa Mobile', label: 'Echipa Mobile' },
    { value: 'Echipa Backend', label: 'Echipa Backend' },
    { value: 'Echipa Frontend', label: 'Echipa Frontend' },
  ]);

  const filteredProjects = useMemo(() => {
    return proiecte
      .filter(project => {
        const matchesSearch = project.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.echipa.numeEchipa.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || project.prioritate === priorityFilter;
        const matchesCategory = categoryFilter === 'all' || project.categorie === categoryFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
      })
      .sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });
  }, [proiecte, searchTerm, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder]);

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
      progres: 0,
      prioritate: 'Înaltă',
      categorie: 'Design'
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

  // Replace the team name input with Select2
  const teamNameSelect = (
    <div>
      <label htmlFor="numeEchipa" className="block text-sm font-medium text-gray-300">
        Nume Echipă
      </label>
      <Select<Option>
        id="numeEchipa"
        value={teamNamesOptions.find(option => option.value === newProject.echipa.numeEchipa)}
        onChange={(option: SingleValue<Option>) => setNewProject(prev => ({
          ...prev,
          echipa: { ...prev.echipa, numeEchipa: option?.value || '' }
        }))}
        options={teamNamesOptions}
        className="mt-1"
        classNamePrefix="select"
        theme={(theme: Theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#4F46E5',
            primary75: '#6366F1',
            primary50: '#818CF8',
            primary25: '#A5B4FC',
            neutral0: '#1F2937',
            neutral5: '#374151',
            neutral10: '#4B5563',
            neutral20: '#6B7280',
            neutral30: '#9CA3AF',
            neutral40: '#D1D5DB',
            neutral50: '#E5E7EB',
            neutral60: '#F3F4F6',
            neutral70: '#F9FAFB',
            neutral80: '#FFFFFF',
            neutral90: '#FFFFFF',
          },
        })}
      />
    </div>
  );

  // Replace the team members input with Select2
  const teamMembersSelect = (
    <div>
      <label className="block text-sm font-medium text-gray-300">
        Echipă
      </label>
      <Select<Option, true>
        isMulti
        value={newProject.echipa.membri.map(member => 
          teamMembersOptions.find(option => option.value === member)
        )}
        onChange={(options: MultiValue<Option>) => setNewProject(prev => ({
          ...prev,
          echipa: {
            ...prev.echipa,
            membri: options.map(option => option.value)
          }
        }))}
        options={teamMembersOptions}
        className="mt-1"
        classNamePrefix="select"
        theme={(theme: Theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#4F46E5',
            primary75: '#6366F1',
            primary50: '#818CF8',
            primary25: '#A5B4FC',
            neutral0: '#1F2937',
            neutral5: '#374151',
            neutral10: '#4B5563',
            neutral20: '#6B7280',
            neutral30: '#9CA3AF',
            neutral40: '#D1D5DB',
            neutral50: '#E5E7EB',
            neutral60: '#F3F4F6',
            neutral70: '#F9FAFB',
            neutral80: '#FFFFFF',
            neutral90: '#FFFFFF',
          },
        })}
      />
    </div>
  );

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
        {/* Filters and Search */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Caută proiecte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Project['status'] | 'all')}
            className="block w-full pl-3 pr-10 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">Toate Statusurile</option>
            <option value="În desfășurare">În desfășurare</option>
            <option value="Finalizat">Finalizat</option>
            <option value="În așteptare">În așteptare</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Project['prioritate'] | 'all')}
            className="block w-full pl-3 pr-10 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">Toate Prioritățile</option>
            <option value="Înaltă">Înaltă</option>
            <option value="Medie">Medie</option>
            <option value="Scăzută">Scăzută</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">Toate Categoriile</option>
            <option value="Design">Design</option>
            <option value="Dezvoltare">Dezvoltare</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
          </select>
        </div>

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
                  Prioritate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Categorie
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
              {filteredProjects.map((proiect) => (
                <tr key={proiect.id} className="hover:bg-gray-700 transition-colors">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      proiect.prioritate === 'Înaltă' ? 'bg-red-100 text-red-800' :
                      proiect.prioritate === 'Medie' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {proiect.prioritate}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {proiect.categorie}
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
                          <div className={`h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center -ml-2 first:ml-0 border-2 border-white overflow-hidden`}>
                            <span className="text-sm font-medium text-indigo-700">
                              {membru.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                      ))}
                      {proiect.echipa.membri.length > 2 && (
                        <div className="flex-shrink-0 -ml-2">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white">
                            <span className="text-sm font-medium text-gray-500">
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
                  <label htmlFor="prioritate" className="block text-sm font-medium text-gray-300">
                    Prioritate
                  </label>
                  <select
                    id="prioritate"
                    value={newProject.prioritate}
                    onChange={e => setNewProject(prev => ({ ...prev, prioritate: e.target.value as Project['prioritate'] }))}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Înaltă">Înaltă</option>
                    <option value="Medie">Medie</option>
                    <option value="Scăzută">Scăzută</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="categorie" className="block text-sm font-medium text-gray-300">
                    Categorie
                  </label>
                  <select
                    id="categorie"
                    value={newProject.categorie}
                    onChange={e => setNewProject(prev => ({ ...prev, categorie: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Design">Design</option>
                    <option value="Dezvoltare">Dezvoltare</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
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

                {teamNameSelect}

                {teamMembersSelect}
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