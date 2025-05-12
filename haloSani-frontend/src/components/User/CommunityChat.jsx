import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiUser, FiChevronUp, FiChevronDown, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue, push, serverTimestamp, update } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANZSa_HyVle2eyDZL0jo8DeOE7KwtarVc",
  authDomain: "halosanichatcom.firebaseapp.com",
  projectId: "halosanichatcom",
  storageBucket: "halosanichatcom.appspot.com",
  messagingSenderId: "421638057459",
  appId: "1:421638057459:web:5d341b1f407452d647b686",
  measurementId: "G-NBNCCG4EBL"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// List of prohibited words
const BAD_WORDS = [
  // Bahasa Inggris
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'slut', 'whore',
  'cunt', 'fag', 'motherfucker', 'nigger', 'twat', 'wanker', 'bollocks', 'bugger',
  'crap', 'damn', 'jerk', 'moron', 'retard', 'suck', 'tosser', 'prick', 'arse',
  'bloody', 'goddamn', 'hell', 'son of a bitch', 'douche', 'douchebag', 'scumbag',
  'shithead', 'cock', 'piss', 'nigga', 'fucker', 'bimbo', 'dipshit', 'jackass',
  'nutjob', 'shitface', 'skank', 'tool', 'tramp', 'turd', 'twit', 'wank', 'wankstain',
  'arsehole', 'bollock', 'bugger', 'clit', 'cockhead', 'cocksucker', 'cum', 'cuntface',
  'dickhead', 'dildo', 'douchebag', 'fanny', 'fart', 'fuckface', 'fuckhead', 'goddamn',
  'jizz', 'knob', 'knobhead', 'minger', 'muppet', 'nob', 'nobhead', 'numpty', 'piss',
  'pissflaps', 'prick', 'punani', 'pussy', 'shitbag', 'shitcunt', 'shite', 'shithead',
  'slag', 'slut', 'spunk', 'tart', 'tit', 'tosser', 'twat', 'twathead', 'wank',
  'wanker', 'wankstain', 'whore',

  // Bahasa Indonesia dan daerah
  'anjing', 'bangsat', 'goblok', 'tolol', 'kontol', 'memek', 'pepek', 'sarap',
  'babi', 'ngentot', 'kampret', 'tai', 'brengsek', 'sinting', 'setan', 'jancuk',
  'cuk', 'nggateli', 'ngapleki', 'bajingan', 'bencong', 'banci', 'maho', 'lonte',
  'hencet', 'taptei', 'kampang', 'keparat', 'bejad', 'gembel', 'anjrit', 'tetek',
  'ngulum', 'jembut', 'totong', 'kolop', 'pukimak', 'bodat', 'heang', 'burit',
  'titit', 'nenen', 'bejat', 'silit', 'sempak', 'pantek', 'taek', 'itil', 'teho',
  'pantat', 'bagudung', 'babami', 'kanciang', 'bungul', 'kimak', 'henceut', 'kacuk',
  'blowjob', 'pussy', 'dick', 'damn',

  // Deteksi tautan dan promosi
  'http://', 'https://', 'www.', '.com', '.net', '.org', '.id', '.co', '.xyz',
  'bit.ly', 'tinyurl', 'wa.me', 'wa ', 'whatsapp', 'no hp', 'nomor hp', 'call me',
  'hubungi', 'kontak', 'cp:', '082', '083', '085', 'line.me', 't.me',
  'telegram', 'instagram.com', 'facebook.com', 'fb.me', 'ig.me', 'snapchat',
  'weebly', 'blogspot', 'wordpress', 'shopee', 'tokopedia', 'bukalapak', 'lazada',
  'blibli', 'olx', 'jual', 'promo', 'diskon', 'gratis', 'free', 'murah', 'transfer',
  'rekening', 'paypal', 'dana', 'ovo', 'gopay', 'linkaja'
];
const MESSAGE_COOLDOWN = 30000; // 30 seconds cooldown between messages

// Avatar colors and styles
const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-red-500', 'bg-orange-500', 'bg-yellow-500',
  'bg-green-500', 'bg-teal-500', 'bg-indigo-500'
];
const AVATAR_STYLES = [
  'rounded-full', 'rounded-lg', 'rounded-2xl',
  'rounded-tl-full rounded-br-full', 'rounded-tr-full rounded-bl-full'
];

const CommunityChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load user data from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('chatUsername') || 
      `User${Math.floor(Math.random() * 10000)}`;
    const userId = localStorage.getItem('chatUserId') || uuidv4();
    
    setUsername(storedUsername);
    localStorage.setItem('chatUserId', userId);
  }, []);

  // Fetch messages from Firebase
  useEffect(() => {
    const messagesRef = ref(db, 'communityChat/messages');
    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val() || {};
      const messagesList = Object.keys(messagesData)
        .map(key => ({
          id: key,
          ...messagesData[key]
        }))
        .filter(msg => !msg.isDeleted) // Filter out deleted messages
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      
      setMessages(messagesList);
    });
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cooldown timer
  useEffect(() => {
    if (!lastMessageTime) return;
    
    const timer = setInterval(() => {
      const remaining = Math.max(0, MESSAGE_COOLDOWN - (Date.now() - lastMessageTime));
      setCooldown(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lastMessageTime]);

  // Filter bad words
  const filterBadWords = (text) => {
    let filteredText = text;
    BAD_WORDS.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    });
    return filteredText;
  };

  // Generate random avatar
  const generateAvatar = (userId) => {
    if (!userId) return AVATAR_COLORS[0];
    
    // Deterministic selection based on user ID
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = AVATAR_COLORS[hash % AVATAR_COLORS.length];
    const style = AVATAR_STYLES[hash % AVATAR_STYLES.length];
    
    return `${color} ${style}`;
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Check cooldown
    if (cooldown > 0) {
      alert(`Please wait ${Math.ceil(cooldown / 1000)} seconds before sending another message`);
      return;
    }

    // Filter bad words
    const filteredMessage = filterBadWords(newMessage);

    // Push message to Firebase
    await push(ref(db, 'communityChat/messages'), {
      text: filteredMessage,
      username,
      timestamp: serverTimestamp(),
      userId: localStorage.getItem('chatUserId'),
      isDeleted: false
    });

    // Update cooldown
    setLastMessageTime(Date.now());
    setNewMessage('');
    inputRef.current?.focus();
  };

  // Unsend message
  const unsendMessage = async (messageId, userId) => {
    const currentUserId = localStorage.getItem('chatUserId');
    if (userId === currentUserId) {
      try {
        await update(ref(db, `communityChat/messages/${messageId}`), {
          isDeleted: true,
          deletedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error unsending message:', error);
        alert('Failed to unsend message');
      }
    }
  };

  // Update username
  const updateUsername = () => {
    if (tempUsername.trim() && tempUsername !== username) {
      const filteredUsername = filterBadWords(tempUsername);
      setUsername(filteredUsername);
      localStorage.setItem('chatUsername', filteredUsername);
      setEditingUsername(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Cooldown progress
  const cooldownProgress = cooldown > 0 ? (1 - (cooldown / MESSAGE_COOLDOWN)) * 100 : 100;

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      >
        <button
          onClick={toggleChat}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
        >
          <FiMessageSquare size={24} />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              {Math.min(messages.length, 9)}
            </span>
          )}
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-6 right-6 w-80 bg-white dark:bg-gray-800 rounded-t-xl shadow-xl z-50 flex flex-col overflow-hidden ${
              isMinimized ? 'h-16' : 'h-[28rem]'
            }`}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center">
                <FiMessageSquare className="mr-2" />
                <span className="font-medium">Community Chat</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMinimize} 
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {isMinimized ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <button 
                  onClick={toggleChat} 
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-700">
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"
                  >
                    No messages yet. Be the first to say hello!
                  </motion.div>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = message.userId === localStorage.getItem('chatUserId');
                    const avatarClass = generateAvatar(message.userId);

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex max-w-[85%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                          {/* Avatar */}
                          <div className="flex-shrink-0 mr-2">
                            <div className={`${avatarClass} w-8 h-8 flex items-center justify-center text-white`}>
                              {message.username.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          
                          {/* Message Content */}
                          <div className={`flex-1 ${isCurrentUser ? 'flex flex-col items-end' : ''}`}>
                            {/* Username and timestamp */}
                            <div className="flex items-center mb-1">
                              {!isCurrentUser && (
                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 mr-2">
                                  {message.username}
                                </span>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            
                            {/* Message bubble */}
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className={`relative p-3 rounded-lg text-sm ${
                                isCurrentUser 
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none' 
                                  : 'bg-gray-100 dark:bg-gray-600 rounded-bl-none'
                              }`}
                            >
                              {message.text}
                              
                              {/* Unsend button */}
                              {isCurrentUser && (
                                <button
                                  onClick={() => unsendMessage(message.id, message.userId)}
                                  className={`absolute -top-2 -left-2 bg-white dark:bg-gray-700 p-1 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors ${
                                    isCurrentUser ? '' : 'hidden'
                                  }`}
                                  title="Unsend message"
                                >
                                  <FiTrash2 size={12} />
                                </button>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* User Profile Section */}
            {!isMinimized && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center"
              >
                <div className="mr-2">
                  <div className={`${generateAvatar(localStorage.getItem('chatUserId'))} w-10 h-10 flex items-center justify-center text-white`}>
                    {username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  {editingUsername ? (
                    <div className="flex">
                      <input
                        type="text"
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        autoFocus
                        maxLength={20}
                      />
                      <button
                        onClick={updateUsername}
                        className="bg-blue-500 text-white px-2 py-1 rounded-r-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {username}
                      </span>
                      <button 
                        onClick={() => {
                          setTempUsername(username);
                          setEditingUsername(true);
                        }}
                        className="ml-2 text-gray-500 hover:text-blue-500 transition-colors"
                        title="Edit username"
                      >
                        <FiEdit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Message Input */}
            {!isMinimized && (
              <motion.form 
                onSubmit={sendMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="relative">
                  {/* Cooldown indicator */}
                  {cooldown > 0 && (
                    <div className="absolute -top-1 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${cooldownProgress}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  )}
                  
                  <div className="flex mt-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={
                        cooldown > 0 
                          ? `Wait ${Math.ceil(cooldown / 1000)}s...` 
                          : "Type a message..."
                      }
                      className="flex-1 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={cooldown > 0}
                    />
                    <motion.button
                      type="submit"
                      className={`px-3 py-2 rounded-r-lg transition-colors ${
                        newMessage.trim() && cooldown <= 0
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                      whileTap={newMessage.trim() && cooldown <= 0 ? { scale: 0.95 } : {}}
                      disabled={!newMessage.trim() || cooldown > 0}
                    >
                      <FiSend />
                    </motion.button>
                  </div>
                </div>
              </motion.form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommunityChat;