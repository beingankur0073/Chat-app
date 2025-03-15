import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import Table from '../../components/shared/Table.jsx'
import { Avatar, Skeleton } from '@mui/material';
import { dashboardData } from '../../constants/sampleData.js';
import { transfromImage } from '../../lib/features.js';
import { useFetchData } from '6pp';
import { server } from '../../constants/config.js';
import { useErrors } from '../../hooks/hook.jsx';
import { useGetAdminUsersQuery } from '../../redux/api/api.js';



const columns=[
{
  field:"id",
  headerName:"ID",
  headerClassName:"table-header",
  width:200,
},

{
  field:"avatar",
  headerName:"Avatar",
  headerClassName:"table-header",
  width:150,
  renderCell:(params)=>(
    <Avatar alt={params.row.name} src={params.row.avatar}/>
  )
},

{
  field:"name",
  headerName:"Name",
  headerClassName:"table-header",
  width:200,
},

{
  field:"username",
  headerName:"Username",
  headerClassName:"table-header",
  width:200,
},

{
  field:"friends",
  headerName:"Friends",
  headerClassName:"table-header",
  width:150,
},

{
  field:"groups",
  headerName:"Groups",
  headerClassName:"table-header",
  width:200,
},

];

const UserManagement = () => {

  const {loading,data,error}=useGetAdminUsersQuery()
  const {stats}=data||[]
  useErrors([{isError:error,error:error}])
  console.log(error)
  const [rows,setRows]=useState([]);

  useEffect(()=>{
    if(data){
      setRows((data.users.map((i)=>({
        ...i,
        id:i._id,
        avatar:transfromImage(i.avatar,50),
      }))));

    }
  },[data])
  return (
    <AdminLayout>

      {
        loading ?(<Skeleton height={"100vh"}/>) :  <Table heading={"All user"} columns={columns} rows={rows}/>
      }
    </AdminLayout>
  )
}

export default UserManagement