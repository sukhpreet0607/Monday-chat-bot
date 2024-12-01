'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';
import { Loader2 } from 'lucide-react';

// Sample data
const SAMPLE_DATA = {
  projects: [
    { project_id: "PRJ001", project_name: "Website Redesign", owner_id: "EMP003", status: "In Progress", start_date: "2024-01-15", due_date: "2024-04-30", budget: 50000, priority: "High", workspace_id: "WS001" },
    { project_id: "PRJ002", project_name: "Mobile App Development", owner_id: "EMP005", status: "Planning", start_date: "2024-02-01", due_date: "2024-07-31", budget: 120000, priority: "High", workspace_id: "WS001" },
    { project_id: "PRJ003", project_name: "Content Marketing Campaign", owner_id: "EMP002", status: "On Hold", start_date: "2024-01-01", due_date: "2024-03-31", budget: 25000, priority: "Medium", workspace_id: "WS002" },
    { project_id: "PRJ004", project_name: "Product Launch", owner_id: "EMP007", status: "Completed", start_date: "2024-02-15", due_date: "2024-03-15", budget: 75000, priority: "High", workspace_id: "WS001" },
    { project_id: "PRJ005", project_name: "Customer Survey Analysis", owner_id: "EMP004", status: "In Progress", start_date: "2024-03-01", due_date: "2024-04-15", budget: 15000, priority: "Low", workspace_id: "WS003" }
  ],
  tasks: [
    { task_id: "TSK001", project_id: "PRJ001", assignee_id: "EMP008", task_name: "Homepage Design", status: "In Progress", priority: "High", start_date: "2024-01-20", due_date: "2024-02-28", completion_percentage: 75 },
    { task_id: "TSK002", project_id: "PRJ001", assignee_id: "EMP009", task_name: "Backend Integration", status: "Not Started", priority: "Medium", start_date: "2024-02-25", due_date: "2024-03-31", completion_percentage: 0 },
    { task_id: "TSK003", project_id: "PRJ001", assignee_id: "EMP010", task_name: "Content Migration", status: "Waiting", priority: "Low", start_date: "2024-03-15", due_date: "2024-04-15", completion_percentage: 0 },
    { task_id: "TSK004", project_id: "PRJ002", assignee_id: "EMP011", task_name: "UI/UX Design", status: "In Progress", priority: "High", start_date: "2024-02-01", due_date: "2024-03-15", completion_percentage: 40 },
    { task_id: "TSK005", project_id: "PRJ002", assignee_id: "EMP012", task_name: "API Development", status: "Not Started", priority: "High", start_date: "2024-03-01", due_date: "2024-04-30", completion_percentage: 0 }
  ],
  employees: [
    { employee_id: "EMP001", name: "John Smith", email: "john.smith@company.com", role: "CEO", department: "Executive", workspace_id: "WS001" },
    { employee_id: "EMP002", name: "Sarah Johnson", email: "sarah.j@company.com", role: "Marketing Director", department: "Marketing", workspace_id: "WS002" },
    { employee_id: "EMP003", name: "Michael Chen", email: "m.chen@company.com", role: "Technical Lead", department: "Engineering", workspace_id: "WS001" },
    { employee_id: "EMP004", name: "Emma Davis", email: "emma.d@company.com", role: "Data Analyst", department: "Analytics", workspace_id: "WS003" },
    { employee_id: "EMP005", name: "David Wilson", email: "d.wilson@company.com", role: "Product Manager", department: "Product", workspace_id: "WS001" },
    { employee_id: "EMP007", name: "James Taylor", email: "j.taylor@company.com", role: "Project Manager", department: "Operations", workspace_id: "WS001" },
    { employee_id: "EMP008", name: "Anna Martinez", email: "a.martinez@company.com", role: "Frontend Developer", department: "Engineering", workspace_id: "WS001" },
    { employee_id: "EMP009", name: "Tom Anderson", email: "t.anderson@company.com", role: "Backend Developer", department: "Engineering", workspace_id: "WS001" },
    { employee_id: "EMP010", name: "Rachel Lee", email: "r.lee@company.com", role: "Content Writer", department: "Marketing", workspace_id: "WS002" },
    { employee_id: "EMP011", name: "Kevin Park", email: "k.park@company.com", role: "UI Designer", department: "Design", workspace_id: "WS001" },
    { employee_id: "EMP012", name: "Julia White", email: "j.white@company.com", role: "Software Engineer", department: "Engineering", workspace_id: "WS001" }
  ]
};

const MondayQueryAssistant = () => {
  const [projectsData, setProjectsData] = useState(SAMPLE_DATA.projects);
  const [tasksData, setTasksData] = useState(SAMPLE_DATA.tasks);
  const [employeesData, setEmployeesData] = useState(SAMPLE_DATA.employees);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      Papa.parse(file, {
        complete: (results) => {
          const headers = results.meta.fields;
          if (headers?.includes('project_name')) {
            setProjectsData(results.data);
          } else if (headers?.includes('task_name')) {
            setTasksData(results.data);
          } else if (headers?.includes('employee_id')) {
            setEmployeesData(results.data);
          }
          setLoading(false);
        },
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employeesData?.find(emp => emp.employee_id === employeeId);
    return employee ? employee.name : employeeId;
  };

  const processQuery = () => {
    setLoading(true);
    setError('');
    
    const queryLower = query.toLowerCase();
    
    try {
      if (queryLower.includes('status') && queryLower.includes('project')) {
        const projectName = projectsData?.find(project => 
          queryLower.includes(project.project_name.toLowerCase())
        );

        if (projectName) {
          const project = projectsData.find(p => p.project_name === projectName.project_name);
          const projectTasks = tasksData?.filter(task => task.project_id === project?.project_id) || [];
          
          const completedTasks = projectTasks.filter(task => task.status === 'Completed').length;
          const totalTasks = projectTasks.length;
          const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

          const owner = getEmployeeName(project?.owner_id || '');

          setResponse(`
Project: ${project?.project_name}
Owner: ${owner}
Status: ${project?.status}
Timeline: ${project?.start_date} to ${project?.due_date}
Progress: ${progress}% tasks completed
Budget: $${project?.budget}
Priority: ${project?.priority}

Tasks Overview:
${projectTasks.map(task => `- ${task.task_name}: ${task.status} (${task.completion_percentage}% complete)
  Assigned to: ${getEmployeeName(task.assignee_id)}`).join('\n')}
          `);
        } else {
          setResponse("I couldn't find that project. Please check the project name and try again.");
        }
      } else if (queryLower.includes('projects') && (queryLower.includes('show') || queryLower.includes('list'))) {
        const projectsList = projectsData.map(project => 
          `- ${project.project_name} (${project.status}) - Owner: ${getEmployeeName(project.owner_id)}`
        ).join('\n');
        
        setResponse(`Here are all projects:\n\n${projectsList}`);
      } else {
        setResponse("I understand you're asking about projects. Try asking:\n1. 'What's the status of [Project Name]?'\n2. 'Show me all projects'");
      }
    } catch (err) {
      console.error('Error processing query:', err);
      setError("Sorry, I encountered an error processing your query. Please make sure all required data is loaded.");
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Monday.com Query Assistant</h2>
          <p className="text-gray-500">Sample data loaded - you can also upload your own Monday.com export files</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Custom Data (Optional):</label>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">
              Sample data loaded: Projects, Tasks, and Employees available
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Try: 'What's the status of Website Redesign project?' or 'Show all projects'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              onClick={processQuery}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Ask'
              )}
            </button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {response && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md whitespace-pre-wrap font-mono text-sm border border-gray-200">
              {response}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MondayQueryAssistant;