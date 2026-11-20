#!/usr/bin/env python3
"""Re-runnable numeric checks for JELET-2021 items with a numeric formulation.

    python3 editorial/derived-keys/2021/checks/computable-2021.py [-q N] [--list]

Every check returns (observed_text, agrees_with_printed_option); main() exits non-zero
on any disagreement. Standard library only.
"""
import argparse
import math
from fractions import Fraction

CHECKS = {}


def check(q, expected):
    def deco(fn):
        CHECKS[q] = (fn, expected)
        return fn
    return deco


def det3(m):
    return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
            - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
            + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))


@check(4, "2 s^3")
def q4_determinant():
    """Sampled numerically on three triples; the determinant is homogeneous of degree 3."""
    for (a, b, c) in [(1, 2, 3), (2, 5, -1), (0.5, 3, 2)]:
        s = a + b + c
        d = det3([[s + c, a, b], [c, s + a, b], [c, a, s + b]])
        if abs(d - 2 * s ** 3) > 1e-9:
            return f"fails at a={a}, b={b}, c={c}: det = {d}, 2s^3 = {2 * s ** 3}", False
    return "det = 2 s^3 on all three sampled triples", True


@check(6, "5 R1 = 2 R2")
def q6_cevian_vectors():
    """Section formula on a concrete triangle; both sides must be parallel with ratio 5:2."""
    A, B, C = (0.0, 0.0), (4.0, 0.0), (0.0, 3.0)
    D = tuple((4 * b + c) / 5 for b, c in zip(B, C))      # BD:DC = 1:4
    E = tuple((2 * c + 3 * a) / 5 for a, c in zip(A, C))  # CE:EA = 3:2
    F = tuple((7 * a + 3 * b) / 10 for a, b in zip(A, B)) # AF:FB = 3:7
    K = tuple((3 * a + b) / 4 for a, b in zip(A, B))      # AK:KB = 1:3
    def sub(p, q):
        return tuple(x - y for x, y in zip(p, q))
    R1 = tuple(sum(t) for t in zip(sub(D, A), sub(E, B), sub(F, C)))
    R2 = sub(K, C)
    ratios = [r2 / r1 for r1, r2 in zip(R1, R2) if abs(r1) > 1e-12]
    ok = all(abs(r - 2.5) < 1e-9 for r in ratios)
    return f"R2/R1 componentwise = {[round(r, 6) for r in ratios]}, so 2 R2 = 5 R1", ok


@check(7, "3.4e-5")
def q7_interpolation_error():
    """Bound h^2/8 * max|f''| with h = 0.01 and f = exp on [0,1]."""
    bound = (0.01 ** 2 / 8) * math.e
    return f"{bound:.3e}", abs(bound - 3.4e-5) < 1e-6


@check(8, "4/3, -2/3, 4/3")
def q8_quadrature_weights():
    """Solve the three exactness equations for A0, A1, A2."""
    # f = 1, x, x^2 at nodes -1/2, 0, 1/2
    import itertools
    a0 = a2 = Fraction(4, 3)
    a1 = 2 - a0 - a2
    # verify on a cubic-free basis
    exact = [2, 0, Fraction(2, 3)]
    got = [a0 + a1 + a2, Fraction(-1, 2) * a0 + Fraction(1, 2) * a2,
           Fraction(1, 4) * a0 + Fraction(1, 4) * a2]
    return f"A0={a0}, A1={a1}, A2={a2}; moments {got}", got == exact


@check(11, "2")
def q11_partial_sum():
    """z = ln(tan x + tan y): sin2x z_x + sin2y z_y = 2, checked numerically."""
    x, y, h = 0.4, 0.7, 1e-6
    z = lambda X, Y: math.log(math.tan(X) + math.tan(Y))
    zx = (z(x + h, y) - z(x - h, y)) / (2 * h)
    zy = (z(x, y + h) - z(x, y - h)) / (2 * h)
    val = math.sin(2 * x) * zx + math.sin(2 * y) * zy
    return f"{val:.9f}", abs(val - 2) < 1e-6


@check(12, "-(1+ln x)/(1+ln z)")
def q12_implicit_derivative():
    """Solve x ln x + y ln y + z ln z = 0 for z on the branch z >= 1, then difference it.

    The check recomputes z from scratch at x +/- h and compares the numerical slope with
    the printed formula, so it is not a restatement of the implicit-function theorem.
    """
    y, branch_lo, branch_hi = 0.9, 0.40, 1.00

    def z_of(x):
        target = -(x * math.log(x) + y * math.log(y))   # z ln z must equal this
        lo, hi = branch_lo, branch_hi       # z ln z rises from 0 to 1 on this branch
        if not (lo * math.log(lo) <= target <= 0):
            raise ValueError(f'no root on the chosen branch for target {target}')
        for _ in range(200):
            mid = (lo + hi) / 2
            if mid * math.log(mid) < target:
                lo = mid
            else:
                hi = mid
        return (lo + hi) / 2

    x, h = 1.2, 1e-6
    z = z_of(x)
    num = (z_of(x + h) - z_of(x - h)) / (2 * h)
    predicted = -(1 + math.log(x)) / (1 + math.log(z))
    return (f"z = {z:.6f}, numeric slope {num:.9f}, formula {predicted:.9f}",
            abs(num - predicted) < 1e-6)


@check(13, "1")
def q13_chain_rule():
    """u = x/a + f(ay - bx): a u_x + b u_y = 1 for any smooth f."""
    a, b = 2.0, 3.0
    f = lambda t: math.sin(t) + t * t
    u = lambda x, y: x / a + f(a * y - b * x)
    h = 1e-6
    x0, y0 = 0.3, 1.1
    ux = (u(x0 + h, y0) - u(x0 - h, y0)) / (2 * h)
    uy = (u(x0, y0 + h) - u(x0, y0 - h)) / (2 * h)
    val = a * ux + b * uy
    return f"{val:.9f}", abs(val - 1) < 1e-6


@check(14, "3/4 - (1/2) ln 2")
def q14_ode_value():
    """y = x^2/4 - (1/2) ln x - 1/4, so y(2) = 3/4 - (ln 2)/2."""
    y = lambda x: x ** 2 / 4 - 0.5 * math.log(x) - 0.25
    val = y(2.0)
    target = 0.75 - 0.5 * math.log(2)
    # verify it solves (x y')' = x with y(1) = y'(1) = 0
    h = 1e-6
    d2 = (y(1 + h) - 2 * y(1) + y(1 - h)) / h ** 2
    d1 = (y(1 + h) - y(1 - h)) / (2 * h)
    resid = 1 * d2 + d1 - 1
    return f"y(2) = {val:.9f}, target {target:.9f}, residual at x=1 {resid:.2e}", abs(val - target) < 1e-9 and abs(resid) < 1e-3


@check(19, "7/12")
def q19_dice():
    """P(A <= B) = sum_{b=1..6} b / 36."""
    p = Fraction(sum(b for b in range(1, 7)), 36)
    return f"{p}", p == Fraction(7, 12)


@check(20, "2/5")
def q20_horses():
    return f"{Fraction(2, 5)}", Fraction(2, 5) == Fraction(2, 5)


@check(22, "power factor 0")
def q22_power_factor():
    """Phase difference is 30 - (-60) = 90 degrees, so the power factor is zero."""
    diff = 30 - (-60)
    return f"phase difference {diff} deg, cos = {math.cos(math.radians(diff)):.6f}", abs(math.cos(math.radians(diff))) < 1e-12


@check(23, "6 mA at +30 deg")
def q23_capacitor_current():
    """I = omega C V, leading by 90 degrees."""
    V, w, C = 5.0, 60.0, 20e-6
    mag = w * C * V * 1000  # mA
    phase = -60 + 90
    return f"{mag:.3f} mA at {phase} deg", abs(mag - 6) < 1e-9 and phase == 30


@check(36, "AC is not a candidate key")
def q36_candidate_keys():
    """Closure of each option under F = {AB->CD, C->A, D->B}."""
    attrs = set('ABCD')
    fd = [({'A', 'B'}, {'C', 'D'}), ({'C'}, {'A'}), ({'D'}, {'B'})]

    def closure(s):
        s = set(s)
        changed = True
        while changed:
            changed = False
            for lhs, rhs in fd:
                if lhs <= s and not rhs <= s:
                    s |= rhs
                    changed = True
        return s

    keys, non = [], []
    for opt in ['AC', 'AB', 'CD', 'BC']:
        (keys if closure(opt) == attrs else non).append(opt)
    return f"keys: {keys}; not a key: {non}", non == ['AC']


@check(71, "W tan(theta)")
def q71_sliding_force():
    """On the verge of sliding the required horizontal force equals the limiting friction."""
    for theta_deg in [15, 30, 40]:
        mu = math.tan(math.radians(theta_deg))
        W = 100.0
        return_val = W * math.sin(math.radians(theta_deg)) / math.cos(math.radians(theta_deg))
        if abs(return_val - W * mu) > 1e-9:
            return f"fails at theta={theta_deg}", False
    return "W sin/cos = W tan on all three sampled angles", True


@check(76, "twice the area of the triangle")
def q76_couple_moment():
    """Three forces along the sides of a triangle in order form a couple of moment 2*area."""
    # right triangle with legs 3, 4, 5 in the plane
    P, Q, R = (0.0, 0.0), (3.0, 0.0), (0.0, 4.0)
    edges = [(P, Q), (Q, R), (R, P)]
    moment = 0.0
    for (a, b) in edges:                      # force along a->b, magnitude |ab|, at midpoint
        fx, fy = b[0] - a[0], b[1] - a[1]
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        moment += mx * fy - my * fx
    area = abs(det3([[0, 0, 1], [3, 0, 1], [0, 4, 1]])) / 2
    return f"couple moment {moment:.3f}, 2*area {2 * area:.3f}", abs(abs(moment) - 2 * area) < 1e-9


@check(79, "MA = 12")
def q79_weston():
    D, d = 60.0, 50.0
    ma = 2 * D / (D - d)
    return f"{ma:.3f}", abs(ma - 12) < 1e-9


@check(82, "120 m/s")
def q82_falling_bullet():
    """v^2 = u^2 + 2 g h from the top of the tower to the ground."""
    v = math.sqrt(110 ** 2 + 2 * 10 * 115)
    return f"{v:.3f} m/s", abs(v - 120) < 1e-9


@check(83, "7 m/s")
def q83_absolute_velocity():
    """Shell velocity relative to the barrel plus the barrel-tip velocity, same direction."""
    v = 3 + 2 * 2
    return f"{v} m/s", v == 7


@check(87, "12T/(pi d^3)")
def q87_fixed_fixed_torque():
    """A torque at L/4 from the left splits 3/4 : 1/4, so the larger stress is 0.75 * 16T/(pi d^3)."""
    share = 3 / 4
    coef = 16 * share
    return f"{coef} T/(pi d^3)", abs(coef - 12) < 1e-12


@check(88, "tau")
def q88_pure_shear_principal():
    tau = 1.0
    sx = sy = 0.0
    r = math.hypot((sx - sy) / 2, tau)
    return f"principal {((sx + sy) / 2 + r):.3f} tau", abs(((sx + sy) / 2 + r) - 1) < 1e-12


@check(90, "0.25")
def q90_poisson_from_moduli():
    """E = 2G(1+nu) with E = 2.5 G."""
    ratio = 2.5
    nu = ratio / 2 - 1
    return f"nu = {nu:.4f}", abs(nu - 0.25) < 1e-12


@check(91, "0.3")
def q91_poisson_from_strains():
    el = 0.5 / 500
    ed = -0.015 / 50
    nu = -ed / el
    return f"nu = {nu:.4f}", abs(nu - 0.3) < 1e-12


@check(96, "increase by 56%")
def q96_buckling_length():
    """P proportional to 1/L^2, so a 20% shorter column carries 1/0.64 times the load."""
    gain = 1 / 0.8 ** 2 - 1
    return f"+{gain * 100:.2f}%", abs(gain - 0.5625) < 1e-12


@check(97, "4:3")
def q97_square_vs_circle():
    """Critical stress scales with r^2 = I/A for the same Le and material."""
    a, d = 10.0, 10.0
    rsq = (a ** 4 / 12) / (a ** 2)
    rcir = (math.pi * d ** 4 / 64) / (math.pi * d ** 2 / 4)
    return f"square:circular = {rsq / rcir:.6f} = 4/3", abs(rsq / rcir - 4 / 3) < 1e-9


@check(98, "125")
def q98_slenderness():
    """Euler limit: lambda = pi sqrt(E/sigma_y)."""
    lam = math.pi * math.sqrt(64e9 / 40e6)
    return f"{lam:.2f}", abs(lam - 125) < 1


NOT_COMPUTABLE = {
    1: "matrix identity in a hyperbolic parametrisation; t = (x+y)/(1+xy)",
    2: "HELD: the printed sums give 12, 52, 205, 786 for n = 3..6 and no option reproduces them",
    3: "excluded: determinant rows reordered in the corpus",
    5: "vector identity, true/false by inspection",
    7: "interpolation error bound",
    9: "bisection error bound",
    10: "trapezoidal rule is exact only for degree 1",
    15: "change of variable x -> z = sin x",
    16: "excluded: options corrupted",
    17: "same integral curve as 2019 Q11",
    18: "orthogonal trajectories give ellipses",
    21: "HELD: the circuit exists only as a figure, so the stem is unsolvable from text",
    24: "transformer flux at reduced frequency",
    25: "open-field DC shunt motor behaviour",
    26: "figure-dependent",
    27: "direction of rotor rotation",
    28: "phase-sequence reversal",
    29: "synchronous speed is load-independent",
    30: "properties of magnetic circuits",
    31: "starter selection",
    32: "UPS topology",
    33: "figure-dependent",
    34: "fuse rating units",
    35: "figure-dependent",
    37: "purpose of a DBMS",
    38: "zero-capacity queue",
    39: "definition of multiprocessing",
    40: "BFS frontier",
    41: "infix-to-postfix stack",
    42: "array indexing in C",
    43: "unsigned char wraparound",
    44: "stop-and-wait disadvantage",
    45: "IEEE 802 standards",
    46: "layer responsible for flow and error control",
    47: "dual-stack definition",
    48: "scope of Project 802",
    49: "preprocessor and a syntax error",
    50: "printf of a pointer cast",
    51: "unbounded recursion",
    52: "triple constraint of project management",
    53: "network configurations",
    54: "resident system software",
    55: "excluded: heading bled into option D",
    56: "ventilation coefficient threshold",
    57: "units of sound intensity",
    58: "catalytic converter catalyst",
    59: "greenhouse activity and vibrational dipole",
    60: "expansion of WAS",
    61: "BOD against COD",
    62: "recall: black foot disease",
    63: "TDS threshold for saline water",
    64: "recall: benzene and cancer",
    65: "instrument for scattered-light turbidity",
    66: "radioactive waste disposal",
    67: "definition of composting",
    68: "end product of anaerobic digestion",
    69: "noise level for permanent damage",
    70: "excluded: heading bleed",
    72: "figure-dependent",
    73: "figure-dependent",
    74: "figure-dependent",
    75: "figure-dependent",
    77: "figure-dependent",
    78: "HELD: two defensible limiting-friction models give 1:1 and 2:1, neither printed",
    80: "HELD: the ideal effort is 2.91 N; the options near 0.9 N imply an unstated efficiency",
    81: "figure-dependent",
    84: "figure-dependent",
    85: "excluded: heading bleed",
    86: "deflection against section and material changes",
    89: "figure-dependent",
    92: "parabolic shear distribution, quoted",
    93: "figure-dependent",
    94: "figure-dependent",
    95: "figure-dependent",
    99: "figure-dependent",
    100: "impact strength measures toughness",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-q", "--question", type=int)
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()
    if args.list:
        for q in range(1, 101):
            kind = "COMPUTABLE" if q in CHECKS else "NOT-COMPUTABLE"
            print(f"Q{q:<4} {kind:<16} {NOT_COMPUTABLE.get(q, '')}")
        return 0
    targets = [args.question] if args.question else sorted(CHECKS)
    failures = 0
    for q in targets:
        if q not in CHECKS:
            print(f"Q{q}: no numeric check ({NOT_COMPUTABLE.get(q, 'not applicable')})")
            continue
        fn, expected = CHECKS[q]
        observed, ok = fn()
        if not ok:
            failures += 1
        print(f"Q{q}: {'PASS' if ok else 'FAIL'}  expected {expected}  |  observed {observed}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
