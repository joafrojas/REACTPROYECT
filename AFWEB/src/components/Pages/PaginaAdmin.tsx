import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import '../../styles/Admin.css';
import { getPosts, savePosts, getUsers, saveUsers, getActiveUser } from '../../utils/validation';

// Página administrativa: listado de posts, usuarios y comentarios.
// Nota: esta vista está pensada como una herramienta de inspección local
// (usa localStorage). No es un panel seguro para un entorno de producción.
const PaginaAdmin: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    try {
      setPosts(getPosts());
    } catch (e) { setPosts([]); }
    try {
      setUsers(getUsers());
    } catch (e) { setUsers([]); }
  }, []);

  const deletePost = (id: string) => {
    const next = posts.filter(p => p.id !== id);
    setPosts(next);
    try { savePosts(next); } catch (e) { localStorage.setItem('asfalto_posts', JSON.stringify(next)); }
  };

  // lista plana de todos los comentarios con referencia a la publicación
  const allComments = posts.flatMap(p => Array.isArray(p.comments) ? p.comments.map((c:any) => ({ ...c, postId: p.id, postTitle: p.title })) : []);

  const deleteUser = (nombre_usu: string) => {
    try {
      const active = getActiveUser();
      if (!active || !(active as any).isAdmin) {
        try { alert('No autorizado. Solo administradores pueden eliminar usuarios.'); } catch (e) {}
        return;
      }
      const reason = window.prompt(`Razón para eliminar el usuario ${nombre_usu} (opcional):`);
      // Si el usuario cancela el prompt, no hacemos nada
      if (reason === null) return;
      const next = users.filter((u: any) => u.nombre_usu !== nombre_usu);
      setUsers(next);
      try { saveUsers(next); } catch (e) { localStorage.setItem('users', JSON.stringify(next)); }
      // Guardar auditoría de eliminación con la razón
      const raw = localStorage.getItem('user_deletions') || '[]';
      const audits = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      audits.push({ user: nombre_usu, reason: reason || '(sin razón)', date: new Date().toISOString() });
      localStorage.setItem('user_deletions', JSON.stringify(audits));
      // Informar al administrador
      try { alert(`Usuario ${nombre_usu} eliminado. Razón guardada.`); } catch (e) {}
    } catch (e) {
      // silencioso
    }
  };

  const toggleAdmin = (nombre_usu: string) => {
    try {
      const all = getUsers();
      const next = all.map((u:any) => u.nombre_usu === nombre_usu ? { ...u, isAdmin: !u.isAdmin } : u);
      setUsers(next);
      saveUsers(next);
      try { alert(`Usuario ${nombre_usu} actualizado. isAdmin=${next.find((x:any)=>x.nombre_usu===nombre_usu)?.isAdmin}`); } catch(e){}
    } catch (e) {
      // silencioso
    }
  };

  const deleteComment = (postId: string, commentId: string) => {
    try {
      const nextPosts = posts.map(p => {
        if (p.id !== postId) return p;
        const comments = Array.isArray(p.comments) ? p.comments.filter((c:any) => c.id !== commentId) : [];
        return { ...p, comments };
      });
      setPosts(nextPosts);
      savePosts(nextPosts);
    } catch (e) {
      // silencioso
    }
  };

  return (
    <div className="admin-page">
      <NavBar />
      <main className="admin-main">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1>Panel Administrativo — Asfalto Fashion</h1>
            <p className="admin-intro">Aquí puedes revisar y administrar datos del sitio (posts, usuarios y chat). Esta es una vista inicial pensada para uso docente/administrador.</p>
          </div>
          <div>
            {/* Acciones administrativas: ninguna acción de "demo" disponible. */}
          </div>
        </div>

        <section className="admin-section">
          <h2>Publicaciones (posts)</h2>
          {posts.length === 0 ? <p>No hay publicaciones.</p> : (
            <ul className="admin-list">
              {posts.map(p => (
                <li key={p.id} className="admin-item">
                  {/* mostrar video si la ruta termina en .mp4, sino imagen */}
                  {typeof p.image === 'string' && p.image.toLowerCase().endsWith('.mp4') ? (
                    <video src={p.image} className="admin-thumb" controls muted loop />
                  ) : (
                    <img src={p.image} alt={p.title} className="admin-thumb" />
                  )}
                  <div className="admin-item-body">
                    <strong>{p.title}</strong>
                    <div className="admin-meta">{p.category} — {p.author}</div>
                            {/* Mostrar contador de likes y lista de comentarios asociada a
                                cada publicación. Esto ayuda al administrador a revisar las
                                interacciones del sitio sin necesidad de backend. */}
                            <div style={{ marginTop: 8, fontSize: 13, color: '#ccc' }}>
                              Likes: <strong style={{ color: '#fff' }}>{(p.likes && p.likes.length) || 0}</strong>
                            </div>
                            {p.comments && p.comments.length > 0 ? (
                              <div style={{ marginTop: 8 }}>
                                <em style={{ color: '#bbb', fontSize: 13 }}>Comentarios:</em>
                                <ul style={{ marginTop: 6 }}>
                                  {p.comments.map((c:any) => (
                                    <li key={c.id} style={{ fontSize: 13, color: '#ddd' }}><strong>{c.user}:</strong> {c.text}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                  </div>
                  <div className="admin-actions">
                    <button onClick={() => deletePost(p.id)} className="btn-danger">Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-section">
          <h2>Usuarios</h2>
          {users.length === 0 ? <p>No hay usuarios registrados.</p> : (
            <ul className="admin-list">
              {users.map((u:any) => (
                <li key={u.nombre_usu} className="admin-item">
                    <div className="admin-item-body">
                      <strong>{u.nombre}</strong>
                      <div className="admin-meta">{u.nombre_usu} — {u.correo}</div>
                      <div style={{ fontSize: 13, color: '#ccc', marginTop: 6 }}>
                        Fecha Nac: {u.fecha_nac || '—'} • Creado: {u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}
                      </div>
                    </div>
                    <div className="admin-actions">
                      <button onClick={() => toggleAdmin(u.nombre_usu)} className="btn-secondary">{u.isAdmin ? 'Quitar admin' : 'Dar admin'}</button>
                      <button onClick={() => deleteUser(u.nombre_usu)} className="btn-danger" style={{ marginLeft: 8 }}>Eliminar</button>
                    </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-section">
          <h2>Comentarios de usuarios</h2>
          <p>Lista de todos los comentarios publicados en las diferentes publicaciones.</p>
          <div className="comments-log">
            {allComments.length === 0 ? (
              <p>No hay comentarios publicados.</p>
            ) : (
              <ul className="admin-list">
                {allComments.map((c:any) => (
                  <li key={c.id} className="admin-item">
                    <div className="admin-item-body">
                      <strong>{c.user}</strong>
                      <div className="admin-meta">En: {c.postTitle}</div>
                      <div style={{ marginTop: 6 }}>{c.text}</div>
                    </div>
                    <div className="admin-actions">
                      <button onClick={() => deleteComment(c.postId, c.id)} className="btn-danger">Eliminar comentario</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default PaginaAdmin;
