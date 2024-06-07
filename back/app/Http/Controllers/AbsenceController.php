<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Absence;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AbsenceController extends Controller
{
    public function submit(Request $request)
    {
        $user_id = Auth::id();

        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $existingAbsence = Absence::where('user_id', $user_id)
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_date', [$request->start_date, $request->end_date])
                        ->orWhereBetween('end_date', [$request->start_date, $request->end_date])
                        ->orWhere(function ($query) use ($request) {
                            $query->where('start_date', '<=', $request->start_date)
                                ->where('end_date', '>=', $request->end_date);
                    });
            })->first();

        if ($existingAbsence) {
            return response()->json(['error' => 'Vous avez déjà une absence posée pour cette période.'], 422);
        }

        $absence = new Absence();
        $absence->user_id = Auth::id();
        $absence->start_date = $request->start_date;
        $absence->end_date = $request->end_date;
        $absence->reason = $request->reason;
        $absence->status_id = 1;
        $absence->save();

        return response()->json(['absence' => $absence, 'message' => 'Absence request submitted successfully'], 201);
    }

    public function index()
    {
        $user_id = Auth::id();
        $absences = Absence::where('user_id', $user_id)->with('status')->get();

        return response()->json(['absences' => $absences], 200);
    }

    public function adminIndex()
    {
        $absences = Absence::with('status')->get();

        return response()->json(['absences' => $absences], 200);
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
}
