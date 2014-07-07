param($installPath, $toolsPath, $package, $project)

$project |
	Remove-Paths 'scalejs.autocomplete' |
	Remove-Shims 'jquery.better-autocomplete' |
	Remove-ScalejsExtension 'scalejs.autocomplete' |
	Out-Null
