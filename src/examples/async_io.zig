const std = @import("std");

pub fn main() !void {
    var debug_allocator: std.heap.DebugAllocator(.{}) = .init;
    defer std.debug.assert(debug_allocator.deinit() == .ok);
    const gpa = debug_allocator.allocator();

    var threaded: std.Io.Threaded = .init(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    var future_a = io.async(say, .{ io, "A" });
    var future_b = io.async(say, .{ io, "B" });

    future_a.await(io);
    future_b.await(io);
}

fn say(io: std.Io, message: []const u8) void {
    for (0..5) |_| {
        io.sleep(.fromMilliseconds(200), .awake) catch {};
        std.debug.print("Hello from: {s}\n", .{message});
    }
}
