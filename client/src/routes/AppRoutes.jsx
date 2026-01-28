import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminTasks from "../pages/admin/AdminTasks";
import AdminWorkflows from "../pages/admin/AdminWorkflows";
import WorkflowDetails from "../pages/admin/WorkflowDetails";
import CreateWorkflow from "../pages/admin/CreateWorkflow";
import CreateTask from "../pages/admin/CreateTask";

function AppRoutes() {
  return (
    <Routes>

     
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

    
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

     
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="workflows" element={<AdminWorkflows />} />
          <Route path="workflows/:workflowId" element={<WorkflowDetails />} />
          <Route path="workflows/:workflowId/createTask" element={<CreateTask />} />
          <Route path="createWorkflow" element={<CreateWorkflow />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default AppRoutes;
