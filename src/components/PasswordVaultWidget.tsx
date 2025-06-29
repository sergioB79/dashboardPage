import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Eye, EyeOff, Copy, Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
}

const PasswordVaultWidget: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const [passwords] = useState<PasswordEntry[]>([
    {
      id: '1',
      title: 'Gmail',
      username: 'user@gmail.com',
      password: '••••••••••',
      website: 'gmail.com',
      category: 'Email'
    },
    {
      id: '2',
      title: 'GitHub',
      username: 'developer',
      password: '••••••••••',
      website: 'github.com',
      category: 'Development'
    },
    {
      id: '3',
      title: 'Banking',
      username: 'account123',
      password: '••••••••••',
      website: 'bank.com',
      category: 'Finance'
    }
  ]);

  const unlock = () => {
    if (masterPassword === 'demo') {
      setIsUnlocked(true);
      setMasterPassword('');
    } else {
      alert('Demo password is "demo"');
    }
  };

  const lock = () => {
    setIsUnlocked(false);
    setShowPasswords({});
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copied to clipboard!`);
  };

  const filteredPasswords = passwords.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isUnlocked) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Password Vault
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-300">Enter master password to unlock</p>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Master password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && unlock()}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
              <Button onClick={unlock} className="w-full bg-blue-600 hover:bg-blue-700">
                Unlock Vault
              </Button>
            </div>
            <p className="text-xs text-slate-500">Demo password: "demo"</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            Password Vault
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={lock}
            className="text-slate-300 hover:text-white"
          >
            Lock
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredPasswords.map((entry) => (
            <div key={entry.id} className="bg-slate-700/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-medium">{entry.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {entry.category}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">{entry.username}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(entry.username, 'Username')}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-mono">
                    {showPasswords[entry.id] ? 'SecurePass123!' : entry.password}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility(entry.id)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                    >
                      {showPasswords[entry.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('SecurePass123!', 'Password')}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs text-slate-500">{entry.website}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordVaultWidget;