interface Project {
    project_id: string;
    project_name: string;
    owner_id: string;
    status: string;
    start_date: string;
    due_date: string;
    budget: number;
    priority: string;
    workspace_id: string;
  }
  
  interface Task {
    task_id: string;
    project_id: string;
    assignee_id: string;
    task_name: string;
    status: string;
    priority: string;
    start_date: string;
    due_date: string;
    completion_percentage: number;
  }
  
  interface Employee {
    employee_id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    workspace_id: string;
  }