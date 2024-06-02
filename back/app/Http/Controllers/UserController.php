<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{

    public function update(Request $request)
    {
        $user = Auth::user();
        Log::info('Request received for user update:', $request->all());

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'firstname' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'password_confirmation' => 'nullable|string|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
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
            $user->password = Hash::make($request->password);
            Log::info('Password updated for user:', ['user_id' => $user->id]);
        }

        Log::info('User after update:', $user->toArray());
        $user->save();

        return response()->json(['user' => $user, 'message' => 'User updated successfully'], 200);
    }


    public function destroy(){
        $id = auth()->user()->id;
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Utilisateur non trouvé'], 404);
        } else {
            $user->delete();
            return response()->json(['message' => 'Utilisateur supprimé avec succès'], 200);
        }
    }
}
