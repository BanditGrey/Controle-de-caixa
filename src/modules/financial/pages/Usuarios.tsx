import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import { User, UserRole } from '../types';

export const Usuarios: React.FC = () => {
  const { users, currentUser, addUser, updateUser, deleteUser, switchUserRole } = useFinancial();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('financeiro');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('financeiro');
    setDepartment('Financeiro');
    setPhone('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setDepartment(u.department || '');
    setPhone(u.phone || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name: name.trim(),
        email: email.trim(),
        role,
        department: department.trim(),
        phone: phone.trim(),
      });
    } else {
      addUser({
        name: name.trim(),
        email: email.trim(),
        role,
        department: department.trim(),
        phone: phone.trim(),
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
        active: true,
      });
    }

    setIsModalOpen(false);
  };

  const isViewer = currentUser.role === 'visualizador';

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Equipe & Controle de Permissões
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gerencie os membros com acesso ao sistema e seus respectivos níveis de permissão
          </p>
        </div>

        <button
          type="button"
          disabled={isViewer}
          onClick={handleOpenAdd}
          className={`flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700 active:bg-purple-800 transition-colors ${
            isViewer ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Membro</span>
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u: User) => {
          const isCurrent = u.id === currentUser.id;
          return (
            <div
              key={u.id}
              className={`rounded-2xl border bg-white p-5 shadow-xs dark:bg-slate-900 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-purple-300 ring-2 ring-purple-500/20 dark:border-purple-800'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={u.name}
                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {u.name}
                        </h4>
                        {isCurrent && (
                          <span className="text-[9px] bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold px-1.5 py-0.2 rounded-sm uppercase">
                            Você
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{u.department || 'Geral'}</p>
                    </div>
                  </div>

                  <Badge status={u.role} size="sm" />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  {u.phone && (
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{u.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => switchUserRole(u.role)}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400"
                >
                  Conectar como →
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={isViewer}
                    onClick={() => handleOpenEdit(u)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isViewer || isCurrent}
                    onClick={() => setDeletingUser(u)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
          Matriz de Níveis de Acesso & Permissões
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Entenda as permissões aplicadas para cada perfil de usuário
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-500 dark:border-slate-800 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Funcionalidade / Módulo</th>
                <th className="py-2.5 px-4 text-center">Administrador</th>
                <th className="py-2.5 px-4 text-center">Financeiro</th>
                <th className="py-2.5 px-4 text-center">Visualizador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                  Visualizar Dashboard, Gráficos & Extratos
                </td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                  Cadastrar & Editar Entradas / Saídas
                </td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><XCircle className="h-4 w-4 text-slate-300 dark:text-slate-700 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                  Baixar Contas a Pagar / Receber
                </td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><XCircle className="h-4 w-4 text-slate-300 dark:text-slate-700 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                  Gerenciar Categorias & Centros de Custo
                </td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><XCircle className="h-4 w-4 text-slate-300 dark:text-slate-700 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                  Exportar Relatórios em PDF, Excel & CSV
                </td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                  Configurações da Empresa, Backup & Equipe
                </td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><XCircle className="h-4 w-4 text-slate-300 dark:text-slate-700 mx-auto" /></td>
                <td className="py-3 px-4 text-center"><XCircle className="h-4 w-4 text-slate-300 dark:text-slate-700 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal (Add / Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Colaborador' : 'Novo Membro da Equipe'}
        subtitle="Defina os dados e o nível de acesso"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Carlos Eduardo Silveira"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              E-mail Corporativo *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@empresa.com.br"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Departamento
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Ex: Financeiro"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 98888-7777"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Perfil de Acesso *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="admin">Administrador (Acesso total)</option>
              <option value="financeiro">Financeiro (Operações e relatórios)</option>
              <option value="visualizador">Visualizador (Somente leitura)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-xs transition-colors"
            >
              {editingUser ? 'Salvar Alterações' : 'Cadastrar Membro'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      {deletingUser && (
        <ConfirmDialog
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={() => deleteUser(deletingUser.id)}
          title="Excluir Usuário"
          message={`Tem certeza que deseja remover o usuário "${deletingUser.name}"?`}
          confirmText="Sim, Remover"
          variant="danger"
        />
      )}
    </div>
  );
};
