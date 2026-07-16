import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getGithubUser(customUsername) {
    const finalUsername = customUsername || username;

    if (!finalUsername || finalUsername.trim() === "") {
      setError("Please enter a GitHub username.");
      setUser(null);
      setRepos([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [userResponse, reposResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${finalUsername}`),
        fetch(`https://api.github.com/users/${finalUsername}/repos?sort=updated&per_page=6`)
      ]);

      if (!userResponse.ok) {
        throw new Error("GitHub user not found");
      }

      const userData = await userResponse.json();
      setUser(userData);

      if (reposResponse.ok) {
        const reposData = await reposResponse.json();
        setRepos(reposData);
      } else {
        setRepos([]);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getGithubUser("thanniruvaishnavi");
  }, []);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      getGithubUser();
    }
  }

  return (
    <div className="app">
      <div className="card">
        <h1>Developer Profile Directory</h1>
        <p className="subtitle">
          Search engine utilizing the official GitHub REST API Core architecture.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search username (e.g., octocat)..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => getGithubUser()}>Search</button>
        </div>

        {loading && (
          <div className="skeleton-container">
            <div className="skeleton skeleton-avatar"></div>
            <div className="skeleton-info">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text" style={{ width: "60%" }}></div>
            </div>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {!loading && user && (
          <div className="profile">
            <div className="profile-top">
              <img src={user.avatar_url} alt={user.login} />

              <div className="profile-info">
                <h2>{user.name || user.login}</h2>
                <p className="login">@{user.login}</p>
                <p className="bio">{user.bio || "No bio provided."}</p>
              </div>
            </div>

            <div className="stats">
              <div className="stat-box">
                <h3>{user.followers}</h3>
                <p>Followers</p>
              </div>

              <div className="stat-box">
                <h3>{user.following}</h3>
                <p>Following</p>
              </div>

              <div className="stat-box">
                <h3>{user.public_repos}</h3>
                <p>Repositories</p>
              </div>
            </div>

            <div className="extra-details">
              {user.location && (
                <p>
                  <strong>Location:</strong> {user.location}
                </p>
              )}
              {user.company && (
                <p>
                  <strong>Organization:</strong> {user.company}
                </p>
              )}
            </div>

            {repos.length > 0 && (
              <div className="repos-section">
                <h3>Active Repositories</h3>
                <div className="repos-grid">
                  {repos.map((repo) => (
                    <a 
                      key={repo.id} 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="repo-card"
                    >
                      <div className="repo-header">
                        <h4>{repo.name}</h4>
                        <span className="repo-language">{repo.language || "Other"}</span>
                      </div>
                      <p className="repo-desc">
                        {repo.description || "No public overview exists for this repository."}
                      </p>
                      <div className="repo-stats">
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🍴 {repo.forks_count}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="footer-actions">
              <a
                className="profile-link"
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
              >
                View Core Profile ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;