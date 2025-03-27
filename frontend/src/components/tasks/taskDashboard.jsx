// src/components/TaskDashboard.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Button, Chip, IconButton, Dialog, Avatar, Badge, 
  Tabs, Tab, TextField, Divider
} from '@mui/material';
import { 
  Plus, MapPin, Clock, DollarSign, CheckCircle, XCircle, 
  AlertCircle, Search, Filter, ArrowUpDown, Bell, Bone, User
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, createTask } from '../../redux/slices/taskSlice';
import { useMediaQuery } from '@mui/material';

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: tasks, status } = useSelector(state => state.task);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-tasks');
  const [sortBy, setSortBy] = useState('newest');

  // Unified task filtering
  const filteredTasks = tasks.filter(task => {
    const isMine = task.owner === user.id;
    const hasApplied = task.applications?.some(app => app.user === user.id);
    
    return activeTab === 'my-tasks' ? isMine : hasApplied;
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Action Button (Mobile) */}
      {isMobile && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="contained"
            className="!rounded-full !p-4 !min-w-0 shadow-xl"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      {/* Dashboard Header */}
      <div className="bg-white shadow-sm p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:items-center">
          <h1 className="text-2xl md:text-3xl font-bold flex-1">
            {activeTab === 'my-tasks' ? 'My Tasks' : 'My Applications'}
          </h1>
          
          <div className="flex gap-3">
            {!isMobile && (
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => setCreateModalOpen(true)}
                className="!rounded-xl"
              >
                New Task
              </Button>
            )}
            
            <Button
              variant="outlined"
              startIcon={<Filter />}
              className="!rounded-xl"
            >
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Navigation Tabs */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
          <div className="flex-1">
            <Tabs 
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab 
                label="My Tasks" 
                value="my-tasks" 
                icon={isMobile ? <User /> : null} 
              />
              <Tab 
                label="Applications" 
                value="applications" 
                icon={isMobile ? <CheckCircle /> : null} 
              />
            </Tabs>
          </div>
          
          <div className="flex gap-2 items-center">
            <Chip
              label={sortBy}
              variant="outlined"
              deleteIcon={<ArrowUpDown className="w-4 h-4" />}
              onDelete={() => setSortBy(prev => 
                prev === 'newest' ? 'oldest' : 'newest'
              )}
              className="!rounded-lg"
            />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {status === 'loading' ? (
              Array(3).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <Bone variant="rectangular" className="!h-40 !rounded-xl" />
                  <Bone className="!mt-2" />
                  <Bone width="60%" />
                </motion.div>
              ))
            ) : filteredTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative">
                    <Avatar className="!w-10 !h-10 !bg-indigo-100">
                      <User className="text-indigo-600" />
                    </Avatar>
                    {task.urgent && (
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                        <div className="bg-red-500 w-3 h-3 rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{task.title}</h3>
                      <Chip
                        label={task.status}
                        size="small"
                        className={`!text-xs ${
                          task.status === 'open' ? '!bg-green-100 !text-green-800' :
                          task.status === 'in_progress' ? '!bg-amber-100 !text-amber-800' :
                          '!bg-gray-100 !text-gray-800'
                        }`}
                      />
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{task.address}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {task.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Chip
                      label={`$${task.budget}`}
                      size="small"
                      className="!bg-emerald-50 !text-emerald-700"
                      icon={<DollarSign className="w-4 h-4" />}
                    />
                    <Badge 
                      badgeContent={task.applications?.length} 
                      color="primary"
                      className="!transform !scale-90"
                    >
                      <Bell className="text-gray-400" />
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    {activeTab === 'my-tasks' ? (
                      <>
                        <IconButton className="!p-1.5">
                          <AlertCircle className="w-5 h-5 text-gray-600" />
                        </IconButton>
                        <IconButton className="!p-1.5">
                          <XCircle className="w-5 h-5 text-red-600" />
                        </IconButton>
                      </>
                    ) : (
                      <Chip
                        label="Applied"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Task Modal */}
      <Dialog 
        fullScreen={isMobile} 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)}
      >
        <motion.div 
          className="p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">New Task</h2>
            <IconButton onClick={() => setCreateModalOpen(false)}>
              <XCircle className="w-6 h-6" />
            </IconButton>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              fullWidth
              label="Task Title"
              variant="outlined"
              className="!rounded-xl"
            />
            <TextField
              fullWidth
              label="Location"
              InputProps={{
                startAdornment: <MapPin className="text-gray-400 mr-2" />
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              className="md:col-span-2"
            />
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <TextField
                label="Budget"
                type="number"
                InputProps={{
                  startAdornment: <DollarSign className="text-gray-400 mr-2" />
                }}
              />
              <Button 
                variant="outlined" 
                startIcon={<Clock />}
                className="!justify-start"
              >
                Set Deadline
              </Button>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3 justify-end">
            <Button 
              variant="outlined" 
              onClick={() => setCreateModalOpen(false)}
              className="!rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              className="!rounded-xl !px-6"
            >
              Create Task
            </Button>
          </div>
        </motion.div>
      </Dialog>
    </div>
  );
};

export default TaskDashboard;