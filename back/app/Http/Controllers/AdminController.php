<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function adminIndex()
    {
        $users = User::with(['absences.status'])->get();

        $result = $users->map(function ($user) {
            return [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'absences' => $user->absences->map(function ($absence) {
                    return [
                        'id' => $absence->id,
                        'start_date' => $absence->start_date,
                        'end_date' => $absence->end_date,
                        'reason' => $absence->reason,
                        'status' => $absence->status->status,
                        'created_at' => $absence->created_at,
                        'updated_at' => $absence->updated_at,
                    ];
                }),
            ];
        });

        return response()->json(['users' => $result], 200);
    }

    public function listUsers()
    {
        $users = User::all();

        return response()->json(['users' => $users], 200);
    }


    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status_id' => 'required|exists:statuses,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $absence = Absence::find($id);
        if (!$absence) {
            return response()->json(['error' => 'Absence not found'], 404);
        }

        $absence->status_id = $request->status_id;
        $absence->save();

        return response()->json(['absence' => $absence, 'message' => 'Absence status updated successfully'], 200);
    }

    public function updateUser(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'firstname' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8|confirmed',
            'password_confirmation' => 'nullable|string|min:8',
            'admin' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($request->filled('name')) {
            $user->name = $request->name;
        }
        if ($request->filled('firstname')) {
            $user->firstname = $request->firstname;
        }
        if ($request->filled('email')) {
            $user->email = $request->email;
        }
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        if ($request->filled('admin')) {
            $user->admin = $request->admin;
        }

        $user->save();

        return response()->json(['user' => $user, 'message' => 'User updated successfully'], 200);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
