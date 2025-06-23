import React, { useState } from 'react';
import { useHighScore } from '../../lib/stores/useHighScore';
import { Trophy, Medal, Award, User, Calendar, Target, X, Trash2 } from 'lucide-react';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const { 
    personalHighScore, 
    allTimeHighScore, 
    leaderboard, 
    playerName, 
    setPlayerName,
    getTopScores,
    cleanupDuplicates 
  } = useHighScore();
  
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  if (!isOpen) return null;

  const handleNameSave = () => {
    setPlayerName(tempName);
    setEditingName(false);
  };

  const handleCleanupDuplicates = async () => {
    await cleanupDuplicates();
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <div className="w-5 h-5 flex items-center justify-center text-cyan-400 font-bold">#{index + 1}</div>;
    }
  };

  const topScores = getTopScores(10);

  // Load leaderboard from database when component mounts
  React.useEffect(() => {
    if (isOpen) {
      cleanupDuplicates && cleanupDuplicates();
    }
  }, [isOpen, cleanupDuplicates]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-cyan-400 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-cyan-400 font-mono">LEADERBOARD</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Player Info & High Scores */}
        <div className="mb-6 p-4 bg-gray-800 border border-gray-600 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-white text-sm"
                    maxLength={20}
                    autoFocus
                  />
                  <button
                    onClick={handleNameSave}
                    className="px-2 py-1 bg-cyan-600 text-white rounded text-xs hover:bg-cyan-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{playerName}</span>
                  <button
                    onClick={() => {
                      setTempName(playerName);
                      setEditingName(true);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-400">Personal Best</div>
              <div className="text-xl font-bold text-cyan-400 font-mono">
                {personalHighScore.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">All-Time Record</div>
              <div className="text-xl font-bold text-yellow-400 font-mono">
                {allTimeHighScore.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Top Scores
          </h3>
          
          {topScores.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No scores yet!</p>
              <p className="text-sm">Play the game to set your first record.</p>
            </div>
          ) : (
            topScores.map((entry, index) => (
              <div
                key={`${entry.date}-${entry.score}-${index}`}
                className={`flex items-center gap-4 p-3 rounded border transition-colors ${
                  entry.name === playerName && entry.score === personalHighScore
                    ? 'bg-cyan-900 border-cyan-600'
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{entry.playerName || entry.name}</span>
                    <span className="font-mono text-lg font-bold text-cyan-400">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.date || (entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Unknown')}
                    </div>
                    <div>Level {entry.level}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button 
            onClick={() => cleanupDuplicates()}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm font-bold transition-colors flex items-center gap-2"
            title="Remove duplicate entries for same players"
          >
            <Trash2 size={16} />
            CLEANUP DUPLICATES
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-mono transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}