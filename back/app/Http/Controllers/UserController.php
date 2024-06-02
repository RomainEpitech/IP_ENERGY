<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{



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
